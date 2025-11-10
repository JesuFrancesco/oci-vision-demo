FROM fnproject/python:3.11

# Install system dependencies required by OpenCV
RUN microdnf install -y \
    libGL \
    glib2 \
    libgomp \
    && microdnf clean all

# Set working directory
WORKDIR /function

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip3 install --target /python --no-cache-dir -r requirements.txt fdk

# Copy function code
COPY . .

# Clean up build artifacts
RUN rm -rf ~/.cache/pip /tmp* .venv func.yaml Dockerfile requirements.txt

# Set Python path
ENV PYTHONPATH=/python:/function

ENTRYPOINT ["/python/bin/fdk", "/function/func.py", "handler"]