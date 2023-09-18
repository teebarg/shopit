# Makefile for building and running the FastAPI app in Docker

# Variables
APP_NAME := shopit
PORT := 6000

# Targets
build:
	docker build -t $(APP_NAME) .

run:
	docker run -p $(PORT):$(PORT) --name $(APP_NAME)-container $(APP_NAME) -v /Users/user/Documents/gigs/niyi/lab/shopit:/app $(APP_NAME)

stop:
	docker stop $(APP_NAME)-container
	docker rm $(APP_NAME)-container

serve:
	uvicorn main:app --host 0.0.0.0 --port 8888  --reload
