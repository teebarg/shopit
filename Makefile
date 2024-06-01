.PHONY: help
.EXPORT_ALL_VARIABLES:

PROJECT_SLUG := "shopit"
APP_NAME := $(PROJECT_SLUG)-backend
PRECOMMIT_CONFIG_PATH = "./dev_config/python/.pre-commit-config.yaml"

help:		## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# ANSI color codes
GREEN=$(shell tput -Txterm setaf 2)
YELLOW=$(shell tput -Txterm setaf 3)
RED=$(shell tput -Txterm setaf 1)
BLUE=$(shell tput -Txterm setaf 6)
RESET=$(shell tput -Txterm sgr0)

## Docker
## Start local development environment
startTest:
	docker compose -p $(PROJECT_SLUG) up --build

# This target can be used in a separate terminal to update any containers after a change in config without restarting (environment variables, requirements.txt, etc)
updateTest:  ## Update test environment containers (eg: after config changes)
	docker compose -p $(PROJECT_SLUG) up --build -d

stopTest: ## Stop test development environment
	@COMPOSE_PROJECT_NAME=$(PROJECT_SLUG) docker compose down


# Utilities
lint-backend:
	@echo "$(YELLOW)Running linters...$(RESET)"
	@cd backend && make format
	# @poetry run pre-commit run --files $$(git diff --name-only $$(git merge-base main $$(git branch --show-current)) $$(git branch --show-current) | tr '\n' ' ') --show-diff-on-failure --config $(PRECOMMIT_CONFIG_PATH)

lint-frontend:
	@echo "$(YELLOW)Running linters for frontend...$(RESET)"
	@cd frontend && npm run lint

lint:
	@$(MAKE) -s lint-backend
	@$(MAKE) -s lint-frontend

test-frontend:
	@echo "$(YELLOW)Running tests for frontend...$(RESET)"
	@cd frontend && npm run test

test-backend:
	@echo "$(YELLOW)Running tests for backend...$(RESET)"
	@cd backend && POSTGRES_SERVER=null PROJECT_NAME=null FIRST_SUPERUSER_FIRSTNAME=null FIRST_SUPERUSER_LASTNAME=null FIRST_SUPERUSER=email@email.com FIRST_SUPERUSER_PASSWORD=null python -m pytest

test:
	@$(MAKE) -s test-backend
	@$(MAKE) -s test-frontend

# Helpers
scaffold:
	@cd scripts && python scaffold.py run -n $(name)


## Command Line
# Spin up Traefik to mimic test/prod CloudFront/ALB setup across multiple services
# Install latest traefik in /usr/local/bin from https://github.com/containous/traefik/releases
lb:
	traefik --entryPoints.dev.address=:4000 --providers.file.filename=local-lb.yml

# Make localhost self-signed cert with: https://github.com/FiloSottile/mkcert
lb-ssl:
	traefik --entryPoints.dev.address=:4000 --providers.file.filename=lb-ssl.yml

# Using Terminal
serve-backend:
	@cd backend; make dev

serve-frontend:
	@cd frontend; make dev

dev:
	pip install -r backend/requirements.txt --require-virtualenv
	make -j 4 lb db serve-backend serve-frontend

prep:
	@cd backend && ./prestart.sh

prep-docker:
	docker exec local-api-1 ./prestart.sh


# Backend Deployment
build:
	docker build -f backend/Dockerfile -t $(APP_NAME) ./backend

stage:
	docker tag $(APP_NAME):latest beafdocker/$(APP_NAME):latest
	docker push beafdocker/$(APP_NAME):latest


# Helpers
c:
	@cd scripts && python controller.py run -n $(name)
