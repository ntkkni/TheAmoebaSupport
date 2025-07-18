#!/bin/bash

if [ -f "./dist/TheAmoebaSupport.zip" ]; then
    rm ./dist/TheAmoebaSupport.zip
fi

zip -r ./dist/TheAmoebaSupport.zip . \
    -x "./.git/*" "./.devcontainer/*" "./dist/*" "./tools/*" ".DS_Store" ".gitignore"
