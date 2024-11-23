#!/usr/bin/env bash
set -euox pipefail
main(){
  wget "https://raw.githubusercontent.com/devicons/devicon/refs/heads/master/icons/github/github-original.svg" \
      -O ./github-original.svg && echo 'this is bigger, deprecated'
  wget "https://github.com/favicon.ico" \
      -O ./github.ico
  wget "https://raw.githubusercontent.com/devicons/devicon/refs/heads/master/icons/cloudflare/cloudflare-original.svg" \
      -O ./cloudflare-original.svg
  wget "https://www.cloudflare.com/favicon.ico" \
      -O ./cloudflare.ico && echo 'this is bigger, deprecated'
  wget "https://brand.fastly.com/cloudinary/brandpad/raw/upload/v1714073368/28444/fastly_favicons.zip" \
      -O ./fastly_favicons.zip && echo 'this is bigger, deprecated'
  wget "https://www.fastly.com/favicon.ico" \
      -O ./fastly.ico
  wget "https://visioguy.github.io/IconSets/aws/icons/amazon_cloudfront.png" \
      -O ./amazon_cloudfront.png  && echo 'this is bigger, deprecated'
  wget "https://www.amazon.com/favicon.ico" \
      -O ./amazon.ico
  wget "https://bunny.net/favicon-32x32.png" \
      -O ./bunnycdn.png  && echo 'this is bigger, deprecated'
  wget "https://bunny.net/favicon.ico" \
      -O ./bunnycdn.ico
  wget "https://www.akamai.com/favicon.ico" \
      -O ./akamai.ico
  wget "https://www.cdn77.com/favicon.ico" \
      -O ./cdn77.ico
  wget "https://www.keycdn.com/favicon.ico" \
      -O ./keycdn.ico
  wget "https://www.netlify.com/favicon.ico" \
      -O ./netlify.ico
}
main
