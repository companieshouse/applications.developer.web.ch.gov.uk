
FROM node:14-alpine as builder

RUN apk add --no-cache git=~2.24 openssh-client=~8.1 build-base=~0.5

WORKDIR /build/app

ARG SSH_PRIVATE_KEY
ARG SSH_PRIVATE_KEY_PASSPHRASE

RUN if [ "${SSH_PRIVATE_KEY}" != "" ]; then \
      mkdir -m 0600 ~/.ssh \
      && ssh-keyscan github.com >> ~/.ssh/known_hosts \
      && echo "${SSH_PRIVATE_KEY}" > ~/.ssh/id_rsa \
      && chmod 600 ~/.ssh/id_rsa \
      && ssh-keygen -p -f ~/.ssh/id_rsa -P "${SSH_PRIVATE_KEY_PASSPHRASE}" -N ""; \
  fi

COPY package.json package-lock.json ./

RUN npm install \
      && mkdir ../node_modules.runtime \
      && cp package.json package-lock.json ../node_modules.runtime \
      && npm install --only=production --prefix ../node_modules.runtime

COPY . .

RUN npm run build && rm -rf node_modules

FROM node:14-alpine

WORKDIR /app

COPY --from=builder /build/node_modules.runtime/node_modules/ ./node_modules
COPY --from=builder /build/app .

CMD ["node", "server.js"]