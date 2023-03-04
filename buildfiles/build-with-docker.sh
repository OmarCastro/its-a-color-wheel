#!/usr/bin/env bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd "$SCRIPT_DIR"/..
docker run --user `id -u`:`id -g` -v `pwd`:/home/pwuser/project  mcr.microsoft.com/playwright:v1.31.2-focal /home/pwuser/project/buildfiles/build.sh