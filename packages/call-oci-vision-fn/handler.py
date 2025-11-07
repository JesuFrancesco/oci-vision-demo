import io
import json
from call_oci_vision import start_video_analysis_job


def handler(ctx, data: io.BytesIO = None):
    try:
        body = json.loads(data.getvalue())

        print(f"Video analysis job started: {res}")

        res = start_video_analysis_job(body.get("input_object_path"))

        print(f"Function completed with result: {res}")

        return json.dumps({"result": res})
    except Exception as e:
        return json.dumps({"error": str(e)})
