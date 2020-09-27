.PHONY: build
build:
	docker-compose build

.PHONY: run
run:
	docker-compose run --rm dev bash

.PHONY: train
train:
	docker-compose run --rm dev python train.py -d training-data.json -test input.txt
