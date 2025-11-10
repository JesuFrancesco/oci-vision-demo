import io
import json
import logging

from fdk import response


def handler(ctx, data: io.BytesIO = None):
    try:
        body = json.loads(data.getvalue())

        logging.getLogger().info("Video analysis job started...")

        input_path = body.get("input_object_path")

        from call_oci_vision import start_video_analysis_job

        res = start_video_analysis_job(input_path)

        logging.getLogger().info(f"Function completed with result: {res}")

        from call_oci_vision import send_email_notification

        send_email_notification(f"Análisis de {input_path} finalizado", res)

        res_body = json.dumps(res)

        return response.Response(
            ctx, response_data=res_body, headers={"Content-Type": "application/json"}
        )
    except Exception as e:
        err_body = json.dumps({"error": str(e)})

        logging.getLogger().error("Error: %s", str(e))
        logging.getLogger().exception("Exception occurred")

        return response.Response(
            ctx, response_data=err_body, headers={"Content-Type": "application/json"}
        )
