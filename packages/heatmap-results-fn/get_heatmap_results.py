import oci
import os
import datetime as dt
from datetime import datetime, timedelta

config = oci.config.from_file(
    "~/.oci/config"
)  # TODO: Adjust if using OCI Functions runtime


def list_heatmap_markets():
    object_storage = oci.object_storage.ObjectStorageClient(config=config)

    NAMESPACE = os.getenv("NAMESPACE")
    BUCKET = os.getenv("BUCKET")
    PREFIX = f"processed-frames/"

    response = object_storage.list_objects(
        namespace_name=NAMESPACE, bucket_name=BUCKET, prefix=PREFIX, delimiter="/"
    )

    # Extract directories (market names)
    markets = []
    for prefix_obj in response.data.prefixes:
        parts = prefix_obj.strip("/").split("/")
        if len(parts) >= 2:
            markets.append(parts[1])

    return sorted(set(markets))


# TODO: add offset and limit parameters
def list_heatmap_recordings(market: str):
    object_storage = oci.object_storage.ObjectStorageClient(config=config)

    NAMESPACE = os.getenv("NAMESPACE")
    BUCKET = os.getenv("BUCKET")
    PREFIX = f"processed-frames/{market}/objects/"

    # No delimiter -> recursive listing
    response = object_storage.list_objects(
        namespace_name=NAMESPACE, bucket_name=BUCKET, prefix=PREFIX
    )

    recordings = set()

    # Each object name will look like: processed-frames/miraflores/objects/1.mp4/frame_001.jpg
    for obj in response.data.objects:
        parts = obj.name.strip("/").split("/")
        if len(parts) >= 4:
            recording_folder = parts[3]  # "1.mp4"
            recordings.add(recording_folder)

    return sorted(recordings)


# TODO: add offset and limit parameters
def get_heatmap_results(market: str, recording_id: str) -> dict:
    """
    Fetches all processed object frames for a given market from Object Storage
    under the prefix 'processed-frames/{market}/objects/'.
    Returns metadata including a temporary preauthenticated URL for each frame.
    """

    NAMESPACE = os.getenv("NAMESPACE")
    BUCKET = os.getenv("BUCKET")
    REGION = os.getenv("OCI_REGION", "us-ashburn-1")  # fallback region
    PREFIX = f"processed-frames/{market}/objects/{recording_id}/"

    os_client = oci.object_storage.ObjectStorageClient(config)

    print(f"Listing objects under prefix: {PREFIX}")

    response = os_client.list_objects(
        namespace_name=NAMESPACE,
        bucket_name=BUCKET,
        prefix=PREFIX,
    )

    objects_info = []

    for obj in response.data.objects:
        try:
            # Create a 1-hour temporary preauthenticated request (par)
            par_request = (
                oci.object_storage.models.CreatePreauthenticatedRequestDetails(
                    name=f"par_{os.path.basename(obj.name)}",
                    access_type="ObjectRead",
                    time_expires=datetime.now(dt.timezone.utc) + timedelta(hours=1),
                    object_name=obj.name,
                )
            )

            par = os_client.create_preauthenticated_request(
                namespace_name=NAMESPACE,
                bucket_name=BUCKET,
                create_preauthenticated_request_details=par_request,
            )

            url = f"https://objectstorage.{REGION}.oraclecloud.com{par.data.access_uri}"

        except Exception as e:
            print(f"Error creating preauth URL for {obj.name}: {e}")
            url = None

        objects_info.append(
            {
                "name": obj.name,
                "size": obj.size,
                "time_created": str(obj.time_created),
                "etag": obj.etag,
                "url": url,
            }
        )

    return {
        "prefix": PREFIX,
        "count": len(objects_info),
        "objects": objects_info,
    }
