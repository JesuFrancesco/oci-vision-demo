from functools import wraps
import threading
import os
import asyncio

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
        # Create a new event loop for this thread
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        consumer = KafkaConsumer(
            topic,
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
            group_id="video-analysis-group",
            consumer_timeout_ms=-1,
            security_protocol="SASL_SSL",
            sasl_mechanism="PLAIN",
            sasl_plain_username=SASL_USERNAME,
            sasl_plain_password=SASL_PASSWORD,
            # auto_offset_reset="earliest",  # Start from beginning if no offset
            # enable_auto_commit=True,
        )
        print(f"✅ Kafka consumer started on topic: {topic}")
        print(f"Connected to: {KAFKA_BOOTSTRAP_SERVERS}")

        try:
            for msg in consumer:
                print(
                    f"📨 Received message from topic '{msg.topic}': {msg.value[:100]}..."
                )  # Log first 100 chars
                try:
                    # Check if callback is a coroutine function
                    if asyncio.iscoroutinefunction(callback):
                        loop.run_until_complete(callback(msg.value))
                    else:
                        callback(msg.value)
                    print(f"✅ Message processed successfully")
                except Exception as e:
                    print(f"❌ Error processing message: {e}")
                    import traceback

                    traceback.print_exc()
        except Exception as e:
            print(f"❌ Consumer error: {e}")
            import traceback

            traceback.print_exc()
        finally:
            consumer.close()

    thread = threading.Thread(target=consume, daemon=True)
    thread.start()
    print(f"🚀 Kafka consumer thread started for topic: {topic}")


def kafka_trigger(topic: str):
    """
    Decorator that registers the wrapped function as a Kafka consumer callback.
    The same function can also be used as a FastAPI route handler.
    """

    def decorator(func):
        # Don't start consumer here - it will be started on app startup

        @wraps(func)
        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)

        # Store metadata for later initialization
        wrapper._kafka_topic = topic
        wrapper._kafka_callback = func

        return wrapper

    return decorator
