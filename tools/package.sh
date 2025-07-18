#!/bin/bash

zip -r ./dist/TheAmoebaSupport.zip . \
    -x "./.git/*" "./.devcontainer/*" "./dist/*" "./tools/*" ".DS_Store" ".gitignore"
