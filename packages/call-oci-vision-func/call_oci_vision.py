import os
import json
import tempfile
from datetime import datetime
from time import sleep
from io import BytesIO

import oci
from oci.ai_vision.models import *
import cv2

signer = oci.auth.signers.get_resource_principals_signer()

human_classes_list = [
    "Person",
    "Human",
    "Man",
    "Woman",
    "Child",
    "Face",
    "Human Face",
    "Human Arm",
    "Adult",
]

TIMESTAMP = datetime.now().strftime("%Y%m%d_%H%M%S")


def send_email_notification(subject: str, body: str):
    """Sends an email notification using OCI Email Delivery service."""

    TOPIC_OCID = os.getenv("EMAIL_TOPIC_OCID")

    email_client = oci.ons.NotificationDataPlaneClient(config={}, signer=signer)

    message_title = f"[oci-vision] {subject}"
    message_body = f"{body}\n\nThis is an automated message."

    # Create a MessageDetails object
    message_details = oci.ons.models.MessageDetails(
        title=message_title, body=message_body
    )

    # Publish the message
    try:
        response = email_client.publish_message(TOPIC_OCID, message_details)
        print(f"Message published successfully. Message ID: {response.data.message_id}")
    except oci.exceptions.ServiceError as e:
        print(f"Error publishing message: {e}")


def extract_and_save_frames(video_object_path: str, video_response_json):
    """
    Downloads the video from Object Storage, extracts frames at the given offsets,
    and uploads them under $KEY/frames/faces or $KEY/frames/objects depending on type.
    """
    NAMESPACE = os.getenv("NAMESPACE")
    BUCKET = os.getenv("BUCKET")
    OUTPUT_NAMESPACE = os.getenv("OUTPUT_NAMESPACE")
    OUTPUT_BUCKET = os.getenv("OUTPUT_BUCKET")
    OUTPUT_PREFIX = "processed-frames"

    object_storage_client = oci.object_storage.ObjectStorageClient(
        config={}, signer=signer
    )

    # --- Download video to temp file ---
    print("Downloading video for frame extraction...")
    video_obj = object_storage_client.get_object(NAMESPACE, BUCKET, video_object_path)
    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as tmp_video:
        tmp_video.write(video_obj.data.content)
        tmp_video_path = tmp_video.name

    # --- Load JSON and detect types ---
    data = json.loads(video_response_json.data.content)
    has_faces = "videoFaces" in data
    has_objects = "videoObjects" in data

    # --- Open video once ---
    cap = cv2.VideoCapture(tmp_video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)

    # --- Process faces ---
    if has_faces:
        print("Extracting frames for detected faces...")
        extract_type_frames(
            data["videoFaces"],
            cap,
            fps,
            object_storage_client,
            OUTPUT_NAMESPACE,
            OUTPUT_BUCKET,
            OUTPUT_PREFIX,
            video_object_path,
            "faces",
        )

    # --- Process objects ---
    if has_objects:
        print("Extracting frames for detected objects...")
        extract_type_frames(
            [
                obj
                for obj in data["videoObjects"]
                if obj.get("name") in human_classes_list
            ],
            cap,
            fps,
            object_storage_client,
            OUTPUT_NAMESPACE,
            OUTPUT_BUCKET,
            OUTPUT_PREFIX,
            video_object_path,
            "objects",
        )

    cap.release()
    print("Frame extraction complete.")


import os
import cv2
from datetime import datetime
from io import BytesIO


def extract_type_frames(
    entities,
    cap,
    fps,
    object_storage_client,
    output_namespace,
    output_bucket,
    output_prefix,
    video_object_path,
    category,
):
    """Extract frames and draw YOLO-style bounding boxes using entity names before uploading."""

    frame_map = {}

    # Group all bounding boxes per frame time offset, including entity name
    for entity in entities:
        entity_name = entity.get("entityName") or entity.get("name") or category
        for segment in entity.get("segments", []):
            for frame in segment.get("frames", []):
                offset = frame["timeOffsetMs"]
                if "boundingPolygon" in frame:
                    bbox = frame["boundingPolygon"].get("normalizedVertices", [])
                    if len(bbox) == 4:
                        frame_map.setdefault(offset, []).append(
                            {"bbox": bbox, "entity_name": entity_name}
                        )

    for offset, detections in frame_map.items():
        frame_index = int((offset / 1000) * fps)
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_index)
        ret, frame = cap.read()
        if not ret:
            print(f"Skipping offset {offset}ms (frame not found).")
            continue

        height, width, _ = frame.shape

        # Draw bounding boxes and labels
        for det in detections:
            bbox = det["bbox"]
            entity_name = det["entity_name"]

            # Convert normalized coordinates (0–1) to pixel values
            x1 = int(bbox[0]["x"] * width)
            y1 = int(bbox[0]["y"] * height)
            x2 = int(bbox[2]["x"] * width)
            y2 = int(bbox[2]["y"] * height)

            # Draw rectangle
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

            # Draw label background
            label = entity_name.upper()
            (text_width, text_height), baseline = cv2.getTextSize(
                label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2
            )
            cv2.rectangle(
                frame,
                (x1, y1 - text_height - 8),
                (x1 + text_width + 2, y1),
                (0, 255, 0),
                -1,
            )

            # Put label text
            cv2.putText(
                frame, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 2
            )

        # Encode annotated frame as JPEG
        _, buffer = cv2.imencode(".jpg", frame)
        frame_bytes = buffer.tobytes()

        # Build storage path with entity name and market
        market = video_object_path.split("/")[0]
        filename = video_object_path.split("/")[-1]
        frame_key = f"{output_prefix}/{market}/{category}/{TIMESTAMP}_{filename}/frame_{offset}.jpg"
        print(f"Uploading {category} frame {offset}ms to {frame_key}")

        # Upload annotated frame
        object_storage_client.put_object(
            namespace_name=output_namespace,
            bucket_name=output_bucket,
            object_name=frame_key,
            put_object_body=BytesIO(frame_bytes),
            content_type="image/jpeg",
        )


def start_video_analysis_job(input_object_path: str) -> bool:
    """Starts a video analysis job using OCI AI Vision service.
    The function configures the job with specified features, input, and output locations.
    """

    COMPARTMENT_ID = os.getenv("COMPARTMENT_ID")
    NAMESPACE = os.getenv("NAMESPACE")
    BUCKET = os.getenv("BUCKET")
    OUTPUT_NAMESPACE = os.getenv("OUTPUT_NAMESPACE")
    OUTPUT_BUCKET = os.getenv("OUTPUT_BUCKET")
    OUTPUT_PREFIX = os.getenv("OUTPUT_PREFIX")

    # Initialize service client with default config file
    video_object_detection_feature = VideoObjectDetectionFeature()
    video_face_detection_feature = VideoFaceDetectionFeature()

    # Setting min confidence and max result per frame

    video_object_detection_feature.min_confidence = 0.66
    video_object_detection_feature.max_results = 20

    video_face_detection_feature.min_confidence = 0.85
    video_face_detection_feature.max_results = 100

    # Selected features for video analysis
    features = [video_object_detection_feature, video_face_detection_feature]

    # Getting video file input location
    object_location_1 = ObjectLocation()
    object_location_1.namespace_name = NAMESPACE
    object_location_1.bucket_name = BUCKET
    object_location_1.object_name = input_object_path
    object_locations = [object_location_1]
    input_location = ObjectListInlineInputLocation()
    input_location.object_locations = object_locations

    # Creating output location
    output_location = OutputLocation()
    output_location.namespace_name = OUTPUT_NAMESPACE
    output_location.bucket_name = OUTPUT_BUCKET
    output_location.prefix = OUTPUT_PREFIX

    # Creating vision client
    ai_service_vision_client = oci.ai_vision.AIServiceVisionClient(
        config={}, signer=signer
    )

    # Creating input for video job
    create_video_job_details = CreateVideoJobDetails()
    create_video_job_details.features = features
    create_video_job_details.compartment_id = COMPARTMENT_ID
    create_video_job_details.output_location = output_location
    create_video_job_details.input_location = input_location

    # Creating video jobs
    res = ai_service_vision_client.create_video_job(
        create_video_job_details=create_video_job_details
    )

    # Getting job ID and current lifecycle state of video file
    job_id = res.data.id
    print(f"Job {job_id} is in {res.data.lifecycle_state} state.")

    # Tracking job progress
    seconds = 0
    while (
        res.data.lifecycle_state == "IN_PROGRESS"
        or res.data.lifecycle_state == "ACCEPTED"
    ):
        print(
            f"Job {job_id} is IN_PROGRESS for {str(seconds)} seconds, progress: {res.data.percent_complete}"
        )
        sleep(3)
        seconds += 3
        res = ai_service_vision_client.get_video_job(video_job_id=job_id)

    print(f"Job {job_id} is in {res.data.lifecycle_state} state.")

    if res.data.lifecycle_state != "SUCCEEDED":
        raise Exception("Video analysis job failed.")

    # Getting object storage client
    object_storage_client = oci.object_storage.ObjectStorageClient(
        config={}, signer=signer
    )
    object_name = f"{OUTPUT_PREFIX}/{job_id}/{object_location_1.object_name}.json"

    # Getting response from object location
    video_response_json = object_storage_client.get_object(
        OUTPUT_NAMESPACE, OUTPUT_BUCKET, object_name
    )

    extract_and_save_frames(input_object_path, video_response_json)

    return {"job_id": job_id, "lifecycle_state": res.data.lifecycle_state}
