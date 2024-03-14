

# to test, use 
#      flask --app minimal run
# to make externally visible, use 
#      flask run --host=0.0.0.0

from flask import Flask
from flask import request
from os import listdir
from os.path import isfile, join
import re
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
    json = request.get_json(force=True)
    
    ts = datetime.datetime.now().strftime("%Y%m%dT%H%M%SZ")
    id = re.sub(r"[^a-zA-Z0-9]+", "", json['id'])
    file = re.sub(r".*[\/]", "", json['filename'])
    filename = re.sub(r"[^a-zA-Z0-9]+", "_", file)    
    code = json['code']
    
    log_name = f"{id}_{filename}_{ts}"
    with open(f"{LOG_DIR}/{log_name}.cpp", 'w') as json_f:
        json_f.write(f"// cricket-comment-start\n")
        json_f.write(f"//   id: {json['id']}\n")
        json_f.write(f"//   addr: {request.remote_addr}\n")
        json_f.write(f"//   time: {ts}\n")
        json_f.write(f"//   path: {json['filename']}\n")
        for k,v in request.headers.items():
            json_f.write(f"//   {k}: {v}\n")
        json_f.write(f"// cricket-comment-end\n")
        json_f.write(code)

    print(f"logging {log_name} - {len(code)} chars")
    return "<p>Hello, World!</p>"

