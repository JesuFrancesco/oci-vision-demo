from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from call_oci_vision import start_video_analysis_job, send_email_notification
from kafka_client import kafka_trigger, start_consumer


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events"""
    # Startup
    print("🚀 Starting Kafka consumers...")

    # Start the consumer for the decorated function
    if hasattr(kafka_video_analyzer, "_kafka_topic"):
        start_consumer(
            kafka_video_analyzer._kafka_topic, kafka_video_analyzer._kafka_callback
        )

    print("✅ Application startup complete")

    yield

    # Shutdown
    print("🛑 Shutting down application...")


app = FastAPI(
    title="OCI Vision Video Analysis Service",
    description="A service that analyzes videos using OCI Vision and can be triggered via HTTP or Kafka messages.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class VideoRequest(BaseModel):
    input_video_path: str


@app.post("/analyze-video")
def analyze_video(request: VideoRequest):
    try:
        print("Video analysis job started...")

        input_path = request.input_video_path
        send_email_notification(
            f"Análisis de {input_path} iniciado", "El análisis de video ha comenzado."
        )

        res = start_video_analysis_job(input_path)
        print(f"Function completed with result: {res}")
        send_email_notification(
            f"Análisis de {input_path} finalizado", f"Resultado: {res}"
        )

        return {"result": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@kafka_trigger(topic="ocivision-kafka-stream")
def kafka_video_analyzer(message: bytes):
    print(f"🎬 Kafka message received: {message.decode('utf-8')}")

    try:
        analyze_video(VideoRequest(input_video_path=message.decode("utf-8")))
    except Exception as e:
        print(f"❌ Error in kafka_video_analyzer: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8080)
