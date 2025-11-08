import io
import json
from dotenv import load_dotenv
import argparse

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Test faces detection OCI function locally"
    )
    parser.add_argument("--market", help="Market identifier (optional)", required=False)
    parser.add_argument(
        "--recording_id",
        help="Recording identifier (optional)",
        required=False,
    )
    args = parser.parse_args()

    load_dotenv(".env")

    from handler import handler

    # --- Build test payload dynamically ---
    query_params = {}
    if args.market:
        query_params["market"] = args.market
    if args.recording_id:
        query_params["recording_id"] = args.recording_id

    test_payload = {"queryParameters": query_params}
    test_data = io.BytesIO(json.dumps(test_payload).encode())

    # --- Run handler ---
    result = handler(None, test_data)
    print(result)
