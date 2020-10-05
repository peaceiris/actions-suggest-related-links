FROM python:3.8-slim-buster

WORKDIR /build
ENV PIP_NO_CACHE_DIR="true"
COPY ./requirements.txt requirements.txt
RUN python3 -m pip install --upgrade pip && \
    python3 -m pip install -r ./requirements.txt && \
    python3 -m pip check && \
    rm -rf /build

WORKDIR /src
