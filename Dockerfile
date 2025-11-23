# Use alpine Python image
FROM python:3.13-alpine

# Set working directory
WORKDIR /app

# Copy requirements first for caching
COPY requirements.txt /app/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY main.py config.ini ./
COPY static ./static
COPY templates/ ./templates

# Default port
ENV PORT=7000

# Expose default port
EXPOSE $PORT

# Run Uvicorn with dynamic port
CMD sh -c "uvicorn main:app --host 0.0.0.0 --port ${PORT}"
