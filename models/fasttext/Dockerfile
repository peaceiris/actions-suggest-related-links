FROM python:3.8-slim-buster

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential && \
    apt-get autoclean && \
    apt-get clean && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /build
ENV PIP_NO_CACHE_DIR="true"

COPY Pipfile Pipfile.lock ${WORKDIR}/

RUN python3 -m pip install --upgrade pip && \
    python3 -m pip install pipenv && \
    pipenv install --system && \
    rm -rf /build

WORKDIR /src
