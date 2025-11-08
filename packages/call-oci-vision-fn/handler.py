import io
import json
from call_oci_vision import start_video_analysis_job, send_email_notification


def handler(ctx, data: io.BytesIO = None):
    try:
        body = json.loads(data.getvalue())

        print("Video analysis job started...")

        input_path = body.get("input_object_path")

        res = start_video_analysis_job(input_path)

        print(f"Function completed with result: {res}")

        send_email_notification(f"Análisis de {input_path} finalizado", res)

        return json.dumps({"result": res})
    except Exception as e:
        return json.dumps({"error": str(e)})
