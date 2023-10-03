# Makefile for building and running the FastAPI app in Docker

# Variables
APP_NAME := frontend
PORT := 4001

# Targets
build:
	docker build -t $(APP_NAME) .

run:
	docker run -p $(PORT):$(PORT) --name $(APP_NAME) -v /Users/user/Documents/gigs/niyi/lab/shopit/frontend/:/app/ $(APP_NAME)

stop:
	docker stop $(APP_NAME)
	docker rm $(APP_NAME)

dev:
	npm run dev
