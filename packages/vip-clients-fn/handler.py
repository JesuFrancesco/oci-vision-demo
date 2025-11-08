import io
import json
from get_vip_clients import list_vip_clients_in_market, list_vip_client_detections


def handler(ctx, data: io.BytesIO = None):
    try:
        event = json.loads(data.getvalue())
    except Exception:
        return json.dumps({"error": "Invalid input"})

    # Extract query parameters
    query_params: dict = event.get("queryParameters", {}) or {}

    market = query_params.get("market")

    if not market:
        res = list_vip_client_detections()
    elif market:
        res = list_vip_clients_in_market(market=market)
    else:
        res = {"error": "Invalid query combination"}

    # Build response
    response = {"data": res}
    return json.dumps(response)
