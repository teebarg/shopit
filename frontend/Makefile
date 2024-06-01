# Variables
PROJECT_SLUG := shopit
APP_NAME := $(PROJECT_SLUG)-frontend
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

lint:
	npm run lint:fix && npm run format