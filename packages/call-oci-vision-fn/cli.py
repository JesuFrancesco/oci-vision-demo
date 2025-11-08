import io
import json
import os
from dotenv import load_dotenv
import argparse

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process video files")
    parser.add_argument("input_file", help="Path to the input video file")
    args = parser.parse_args()

    load_dotenv(".env")

    from handler import handler

    # Example test run
    test_data = io.BytesIO(json.dumps({"input_object_path": args.input_file}).encode())
    print(handler(None, test_data))
