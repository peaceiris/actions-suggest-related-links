IMAGE_NAME := docker.pkg.github.com/peaceiris/actions-suggest-related-links/asrl-fasttext:latest

.PHONY: build
build:
	# docker-compose build
	docker build -t ${IMAGE_NAME} .

.PHONY: run
run:
	# docker-compose run --rm dev bash
	docker run --rm -i -t -v ${PWD}:/src ${IMAGE_NAME} bash
