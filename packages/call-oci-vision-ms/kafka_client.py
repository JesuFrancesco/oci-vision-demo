from functools import wraps
import threading
import json
import os

from kafka import KafkaConsumer


def start_consumer(topic: str, callback):
    """Start a Kafka consumer in a background thread and call the callback for each message."""

    # Usando auth normal
    # https://docs.oracle.com/en-us/iaas/Content/Streaming/Tasks/kafkacompatibility_topic-Configuration.htm#top__Configuration-Authentication
    SASL_USERNAME = os.getenv("SASL_USERNAME")
    SASL_PASSWORD = os.getenv("SASL_PASSWORD")
    KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS")

    if not SASL_USERNAME or not SASL_PASSWORD or not KAFKA_BOOTSTRAP_SERVERS:
        raise ValueError(
            "SASL_USERNAME, SASL_PASSWORD, and KAFKA_BOOTSTRAP_SERVERS must be set in environment variables."
        )

    def consume():
        consumer = KafkaConsumer(
            topic,
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
            group_id="video-analysis-group",
            consumer_timeout_ms=-1,
            security_protocol="SASL_SSL",
            sasl_mechanism="PLAIN",
            sasl_plain_username=SASL_USERNAME,
            sasl_plain_password=SASL_PASSWORD,
        )
        print(f"Kafka consumer started on topic: {topic}")
        for msg in consumer:
            try:
                print(f"Received message: {msg.value}")
                callback(msg.value)
            except Exception as e:
                print(f"Error processing message: {e}")

    threading.Thread(target=consume, daemon=True).start()


def kafka_trigger(topic: str):
    """
    Decorator that registers the wrapped function as a Kafka consumer callback.
    The same function can also be used as a FastAPI route handler.
    """

    def decorator(func):
        start_consumer(topic, func)

        @wraps(func)
        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)

        return wrapper

    return decorator
