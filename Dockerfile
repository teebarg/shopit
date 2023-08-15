# Use the official Python image as the base image
FROM python:3.11

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Create and set the working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libffi-dev \
    python3-dev \
    libssl-dev

# Copy the requirements.txt file to the container
COPY requirements.txt .

# Install the project dependencies
RUN pip install -r requirements.txt

# Install uvicorn explicitly
RUN pip install uvicorn

# Copy the entire project to the container's working directory
COPY . .

# Expose port 6000 (the port your FastAPI app is listening on)
EXPOSE 6000

# Use the full path to uvicorn when starting the application
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "6000"]
