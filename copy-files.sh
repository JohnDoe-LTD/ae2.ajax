#!/bin/bash

# crear estructura y copia de ficheros
mkdir -p dist/assets/images &&
    mkdir -p dist/assets/scripts &&
    mkdir -p dist/assets/data &&
    mkdir -p dist/assets/styles &&
    cp -r ./src/assets/images -t ./dist/assets &&
    cp -r ./src/assets/data -t ./dist/assets &&
    cp ./src/index.html ./dist/index.html