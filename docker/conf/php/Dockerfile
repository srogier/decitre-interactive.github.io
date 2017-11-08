FROM php:7.2.0RC5-cli

# conf du user local
ARG uid=1008
ARG gid=1008

RUN groupadd -g ${gid} localUser \
    && useradd -u ${uid} -g ${gid} -m -s /bin/bash localUser

WORKDIR /srv/jekyll

