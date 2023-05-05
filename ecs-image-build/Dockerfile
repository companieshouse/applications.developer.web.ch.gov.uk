ARG IMAGE_VERSION="latest"
FROM 416670754337.dkr.ecr.eu-west-2.amazonaws.com/ci-node-build-14:${IMAGE_VERSION} as builder
#FROM node:14-alpine as builder

ARG S3_RELEASE_BUCKET=""
ARG APPLICATION_NAME=applications.developer.web.ch.gov.uk
ARG APPLICATION_VERSION=""
ARG AWS_ACCESS_KEY_ID=""
ARG AWS_SECRET_ACCESS_KEY=""
ARG AWS_REGION="eu-west-2"

WORKDIR /opt

RUN yum install -y zip gzip tar aws-cli \
    && yum clean all \
    && aws s3 cp s3://${S3_RELEASE_BUCKET}/applications.developer.web.ch.gov.uk/applications.developer.web.ch.gov.uk-${APPLICATION_VERSION}.zip . \
    && unzip applications.developer.web.ch.gov.uk-${APPLICATION_VERSION}.zip \
    && rm -f applications.developer.web.ch.gov.uk-${APPLICATION_VERSION}.zip

CMD ["./start.sh"]