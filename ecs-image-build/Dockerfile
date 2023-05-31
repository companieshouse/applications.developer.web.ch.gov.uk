ARG IMAGE_VERSION="latest"
FROM 416670754337.dkr.ecr.eu-west-2.amazonaws.com/ci-node-build-14:${IMAGE_VERSION} 

ARG APPLICATION_NAME=applications.developer.web.ch.gov.uk
ARG PORT="3000"
ARG NODE_PORT="3000"

WORKDIR /opt
COPY /app .
COPY docker_start.sh .

CMD ["./docker_start.sh"]