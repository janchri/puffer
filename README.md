# FastAPI Temperature Dashboard

This project provides a FastAPI backend that reads temperature data from InfluxDB and serves it via an API. The Uvicorn server port and InfluxDB credentials can be configured using an `.env` file.

---

## Create Env File

Create a `.env` file in the project root with the following content:

```ini
# InfluxDB settings
INFLUXDB_URL=<YOURURL>
INFLUXDB_TOKEN=<YOURTOKEN>
INFLUXDB_ORG=<YOURORG>
INFLUXDB_BUCKET=<YOURBUCKET>

# Uvicorn port
PORT=8080
