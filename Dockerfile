FROM 416670754337.dkr.ecr.eu-west-2.amazonaws.com/local/configure-local-ssh
FROM 416670754337.dkr.ecr.eu-west-2.amazonaws.com/ci-node-runtime-20

WORKDIR /opt

COPY --from=0 ./ ./

COPY . .

CMD [ "./docker_start.sh" ]

EXPOSE 3000
