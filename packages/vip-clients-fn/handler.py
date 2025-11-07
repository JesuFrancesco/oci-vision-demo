import io
import json


def handler(ctx, data: io.BytesIO = None):
    # Parse incoming event data
    try:
        event = json.loads(data.getvalue())
    except Exception:
        return json.dumps({"error": "Invalid input"})

    # Extract query parameters from event
    query_params = event.get("queryParameters", {})

    # Example: get 'name' parameter
    name = query_params.get("name", "World")

    # Build response
    response = {"message": f"Hello, {name}!", "received_params": query_params}
    return json.dumps(response)
