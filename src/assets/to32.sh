#!/usr/bin/env bash
set -euox pipefail
main() {
    local in="${1}"
    local out="${2}"
    convert \
        ${in} \
        -resize 32x32 \
        -background none \
        -gravity center \
        -extent 32x32 \
        -matte \
        ./"${out}"
}
main "$@"
