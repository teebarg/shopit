.PHONY: help
.EXPORT_ALL_VARIABLES:

# environment variables

help:		## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# Spin up Traefik to mimic test/prod CloudFront/ALB setup across multiple services
# Install latest traefik in /usr/local/bin from https://github.com/containous/traefik/releases
lb:
	traefik --entryPoints.dev.address=:4000 --providers.file.filename=lb.yml

# Make localhost self-signed cert with: https://github.com/FiloSottile/mkcert
lb-ssl:
	traefik --entryPoints.dev.address=:4000 --providers.file.filename=lb-ssl.yml

# Using Terminal
serve-backend:
	@cd backend; make dev

serve-frontend:
	@cd frontend; make dev

dev:
	make -j 3 lb serve-backend serve-frontend

# Using Docker
## Start local development environment
start:
	docker compose -p local -f docker/docker-compose.yml --env-file docker/local.env up --build

## Stop test development environment
stop:
	@COMPOSE_PROJECT_NAME=test docker compose -f docker/docker-compose.yml down

# This target can be used in a separate terminal to update any containers after a change in config without restarting (environment variables, requirements.txt, etc)
update:
	docker compose -p local -f docker/docker-compose.yml --env-file docker/local.env up --build -d
