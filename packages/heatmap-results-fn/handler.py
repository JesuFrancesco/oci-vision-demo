import io
import json
from get_heatmap_results import (
    get_heatmap_results,
    list_heatmap_markets,
    list_heatmap_recordings,
)


def handler(ctx, data: io.BytesIO = None):
    try:
        event = json.loads(data.getvalue())
    except Exception:
        return json.dumps({"error": "Invalid input"})

    # Extract query parameters
    query_params: dict = event.get("queryParameters", {}) or {}
    market = query_params.get("market")
    recording_id = query_params.get("recording_id")

    # --- No market: return all markets
    if not market:
        print("No market provided, listing all markets")
        res = list_heatmap_markets()

    # --- Market provided, no recording: return recordings
    elif market and not recording_id:
        print(f"Market provided ({market}), no recording, listing recordings")
        res = list_heatmap_recordings(market)

    # --- Market and recording provided: return frames/images
    elif market and recording_id:
        print(
            f"Market and recording provided ({market}, {recording_id}), listing results"
        )
        res = get_heatmap_results(market, recording_id)

    else:
        res = {"error": "Invalid query combination"}

    # Build response
    response = {"data": res}
    return json.dumps(response)
