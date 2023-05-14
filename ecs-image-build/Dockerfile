ARG IMAGE_VERSION="latest"
FROM 416670754337.dkr.ecr.eu-west-2.amazonaws.com/ci-node-build-14:${IMAGE_VERSION} as builder
#FROM node:14-alpine as builder

ARG S3_RELEASE_BUCKET=""
ARG APPLICATION_NAME=applications.developer.web.ch.gov.uk
ARG APPLICATION_VERSION=""
ARG AWS_ACCESS_KEY_ID=""
ARG AWS_SECRET_ACCESS_KEY=""
ARG AWS_REGION="eu-west-2"
ARG FILE_NAME=""
ARG PORT="3000"


WORKDIR /opt

RUN yum install -y zip gzip tar aws-cli \
    && yum clean all \
    && aws s3 cp s3://${S3_RELEASE_BUCKET}/${APPLICATION_NAME}/${FILE_NAME} . \
    && unzip ${FILE_NAME} \
    && rm -f ${FILE_NAME} 

RUN npm config set registry http://registry.npmjs.org \
      && npm -g install npm \
      && npm install \
      && mkdir /opt/node_modules.runtime \
      && cp package.json package-lock.json /opt/node_modules.runtime \
      && npm install --only=production --prefix /opt/node_modules.runtime \
      && npm run build && rm -rf node_modules \
      && npm cache clean -f

ARG IMAGE_VERSION="latest"
FROM 416670754337.dkr.ecr.eu-west-2.amazonaws.com/ci-node-build-14:${IMAGE_VERSION}

ARG NODE_PORT="3000"

WORKDIR /opt

COPY --from=builder /opt/node_modules.runtime/node_modules/ ./node_modules
COPY --from=builder /opt/* .

CMD ["node", "server.js"]