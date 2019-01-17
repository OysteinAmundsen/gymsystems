#!/bin/bash

# Build docker images
yarn build:docker

# get image names without tags for all started containers
IMAGES=$(docker-compose -f orchestration/docker-compose.yaml config | grep 'image: gymsystems' | awk -F ':' '{print $2}')

# get package version info
IMAGE_TAG=$(grep -m 1 '"version"' package.json | sed '-r' 's/^ *//;s/.*: *"//;s/",?//')

# Login, iterate over images, re-tag and push to docker-hub
docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD" ;
for image in ${IMAGES}
do
  docker tag "${image}" "${image}":"${IMAGE_TAG}"
  docker push ${image} ;
done
