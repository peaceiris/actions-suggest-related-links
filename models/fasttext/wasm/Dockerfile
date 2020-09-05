FROM emscripten/emsdk:2.0.0

ENV DEBIAN_FRONTEND="noninteractive"
ENV FASTTEXT_VERSION="0.9.2"

WORKDIR /build
RUN git clone https://github.com/facebookresearch/fastText.git && \
    cd fastText && \
    git checkout a20c0d27cd0ee88a25ea0433b7f03038cd728459 && \
    make wasm && \
    rm -rf /build
