import os
import configparser
from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from influxdb_client import InfluxDBClient
import uvicorn

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

# Read configuration
config = configparser.ConfigParser()
config.read("config.ini")

# InfluxDB settings, token comes from env variable
INFLUXDB_URL = os.getenv("INFLUXDB_URL", config["INFLUXDB"]["url"])
INFLUXDB_TOKEN = os.getenv("INFLUXDB_TOKEN")  # must be set externally
INFLUXDB_ORG = os.getenv("INFLUXDB_ORG", config["INFLUXDB"]["org"])
INFLUXDB_BUCKET = os.getenv("INFLUXDB_BUCKET", config["INFLUXDB"]["bucket"])

if not INFLUXDB_TOKEN:
    raise RuntimeError("INFLUXDB_TOKEN environment variable is required!")

client = InfluxDBClient(url=INFLUXDB_URL, token=INFLUXDB_TOKEN, org=INFLUXDB_ORG)
query_api = client.query_api()

# Measurements mapping
raw_mapping = dict(config["MEASUREMENTS"])
MEASUREMENT_MAPPING = {k.upper(): v for k, v in raw_mapping.items()}

@app.get("/")
def read_root():
    return FileResponse("index.html")

@app.get("/api/temperatures/last")
def get_last_temperature():
    measurements = list(MEASUREMENT_MAPPING.keys())
    print(measurements)
    filter_str = " or ".join([f'r["_measurement"] == "{m}"' for m in measurements])

    flux_query = f'''
    from(bucket: "{INFLUXDB_BUCKET}")
      |> range(start: -1h)
      |> filter(fn: (r) => r["_field"] == "value")
      |> filter(fn: (r) => {filter_str})
      |> last()
    '''

    result = query_api.query(flux_query)

    last_values = []
    for table in result:
        for record in table.records:
            measurement = record.get_measurement()
            last_values.append({
                "id": MEASUREMENT_MAPPING.get(measurement, measurement),
                "value": record.get_value(),
                "time": record.get_time().isoformat()
            })

    if not last_values:
        return JSONResponse(content={"error": "No data found"}, status_code=404)

    return JSONResponse(content=last_values)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
