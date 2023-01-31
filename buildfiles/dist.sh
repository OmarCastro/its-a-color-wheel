SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd "$SCRIPT_DIR"/..

./buildfiles/build.sh

mkdir -p dist/browser

cp build/dist/* dist/browser