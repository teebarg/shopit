# Makefile for building and running the FastAPI app in Docker

# Variables
APP_NAME := backend
PORT := 4002

# Targets
build:
	docker build -t $(APP_NAME) .

run:
	docker run -p $(PORT):$(PORT) --name $(APP_NAME) -v /Users/user/Documents/gigs/niyi/lab/shopit/backend:/app:ro $(APP_NAME)

stop:
	docker stop $(APP_NAME)
	docker rm $(APP_NAME)

dev:
	uvicorn main:app --host 0.0.0.0 --port $(PORT)  --reload

format:
	black .
	ruff --fix .
