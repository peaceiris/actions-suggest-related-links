COMPOSE_BASE_COMMAND = docker-compose run --rm dev

.PHONY: build
build:
	docker-compose build

.PHONY: run
run:
	${COMPOSE_BASE_COMMAND} bash

.PHONY: fmt
fmt:
	${COMPOSE_BASE_COMMAND} black .

.PHONY: cifmt
cifmt:
	${COMPOSE_BASE_COMMAND} black --check --diff .

.PHONY: isort
isort:
	${COMPOSE_BASE_COMMAND} isort --profile black ./**.py

.PHONY: ciisort
ciisort:
	${COMPOSE_BASE_COMMAND} isort --profile black --check-only ./**.py

.PHONY: lint
lint:
	${COMPOSE_BASE_COMMAND} flake8 --show-source

.PHONY: all
all:
	$(MAKE) fmt
	$(MAKE) isort
	$(MAKE) lint
