import oci
import os
import datetime as dt
from datetime import datetime, timedelta, timezone

config = oci.config.from_file(
    "~/.oci/config"
)  # TODO: Adjust if using OCI Functions runtime


def list_vip_clients_in_market(market: str, offset: int = 0, limit: int = 100) -> dict:
    object_storage = oci.object_storage.ObjectStorageClient(config=config)

    NAMESPACE = os.getenv("NAMESPACE")
    BUCKET = os.getenv("BUCKET")
    REGION = os.getenv("OCI_REGION", "us-ashburn-1")
    PREFIX = f"processed-frames/{market}/faces/"

    # Recursive listing (no delimiter)
    response = object_storage.list_objects(
        namespace_name=NAMESPACE,
        bucket_name=BUCKET,
        prefix=PREFIX,
    )

    # Paginate results manually
    all_objects = response.data.objects
    paginated_objects = all_objects[offset : offset + limit]

    objects_info = []

    for obj in paginated_objects:
        try:
            # Create 1-hour preauthenticated URL
            par_request = (
                oci.object_storage.models.CreatePreauthenticatedRequestDetails(
                    name=f"par_{os.path.basename(obj.name)}",
                    access_type="ObjectRead",
                    time_expires=datetime.now(timezone.utc) + timedelta(hours=1),
                    object_name=obj.name,
                )
            )

            par = object_storage.create_preauthenticated_request(
                namespace_name=NAMESPACE,
                bucket_name=BUCKET,
                create_preauthenticated_request_details=par_request,
            )

            url = f"https://objectstorage.{REGION}.oraclecloud.com{par.data.access_uri}"

        except Exception as e:
            print(f"Error creating PAR for {obj.name}: {e}")
            url = None

        objects_info.append(
            {
                "name": obj.name,
                "size": obj.size,
                "etag": obj.etag,
                "time_created": (
                    obj.time_created.isoformat() if obj.time_created else None
                ),
                "url": url,
            }
        )

    return {
        "count": len(objects_info),
        "offset": offset,
        "limit": limit,
        "objects": objects_info,
    }


def list_vip_client_detections(offset: int = 0, limit: int = 100) -> dict:
    """
    Lists all processed frames stored under any 'faces/' folder in Object Storage.
    Returns metadata and preauthenticated URLs for each frame.
    Supports optional pagination via offset and limit.
    """

    NAMESPACE = os.getenv("NAMESPACE")
    BUCKET = os.getenv("BUCKET")
    REGION = os.getenv("OCI_REGION", "us-ashburn-1")
    PREFIX = "processed-frames"

    os_client = oci.object_storage.ObjectStorageClient(config)

    print(f"Listing objects recursively under prefix: {PREFIX}")

    # Retrieve all objects (no delimiter for deep traversal)
    response = os_client.list_objects(
        namespace_name=NAMESPACE, bucket_name=BUCKET, prefix=PREFIX
    )

    objects_info = []
    all_objects = [
        obj
        for obj in response.data.objects
        if "/faces/" in obj.name  # <-- filter for "faces/" anywhere in the path
    ]

    # Apply offset and limit manually
    # selected_objects = all_objects[offset : offset + limit]
    selected_objects = all_objects

    for obj in selected_objects:
        try:
            # Create a temporary preauthenticated URL (valid 1 hour)
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
        # "offset": offset,
        # "limit": limit,
        "objects": objects_info,
    }
