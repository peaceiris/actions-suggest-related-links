IMAGE_NAME := peaceiris/actions-suggest-related-links-models:latest

.PHONY: build
build:
	# docker-compose build --build-arg NODE_VERSION=$(NODE_VERSION)
	docker build -t ${IMAGE_NAME}

.PHONY: run
run:
	# docker-compose run --rm dev bash
	docker run --rm -i -t -v ${PWD}:/src ${IMAGE_NAME} bash
