

# to test, use 
#      flask --app minimal run
# to make externally visible, use 
#      flask run --host=0.0.0.0

from flask import Flask
from flask import request
from os import listdir
from os.path import isfile, join
import datetime

app = Flask(__name__)

LOG_DIR = "./logs"

@app.get("/list")
def list_all_logs():
    print("Listing logs")
    files = [f for f in listdir(LOG_DIR) if isfile(join(LOG_DIR, f))]
    return "\n".join(files)

@app.post("/log")
def post_received():
    ts = datetime.datetime.now(datetime.UTC).strftime("%Y%m%dT%H%M%SZ")
    json = request.get_json(force=True)
    log_name = f"{ts}_{id}"
    with open(f"{log_name}.json", 'w') as json_f:
        json_f.write(json)

    print(f"logging {log_name} - {len[str(json)]} bytes")
    return "<p>Hello, World!</p>"

