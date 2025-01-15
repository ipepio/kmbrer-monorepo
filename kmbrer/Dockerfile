# Especificamos la versión de Node.js
ARG NODE_VERSION=18.20.3-bookworm-slim

#### Imagen base ####
FROM node:${NODE_VERSION} AS base

WORKDIR /usr/src/app

ENV PATH="${PATH}:/usr/src/app/node_modules/.bin"
ARG USER_ID=1000
ARG USER_NAME=node

RUN chown -R ${USER_NAME}: /usr/src/app

FROM base AS development

ENV PROMPT="%B%F{cyan}%n%f@%m:%F{yellow}%~%f %F{%(?.green.red[%?] )}>%f %b"

RUN apt update -q \
 && apt install -y --no-install-recommends \
        zsh \
 && apt clean

RUN if [ ${USER_ID} -ne 1000 ]; then \
       groupmod -g ${USER_ID} ${USER_NAME} \
 &&    usermod -u ${USER_ID} -g ${USER_ID} ${USER_NAME}; \
    fi \
 && chown -R ${USER_NAME}: .

USER ${USER_NAME}

RUN touch /home/${USER_NAME}/.zshrc

#### Imagen de Construcción ####
FROM base AS builder
ENV NODE_ENV production
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build


#### Imagen para Producción ####
FROM base AS runtime
ENV NODE_ENV production
COPY --from=builder --chown=node:node /usr/src/app .

USER node

CMD ["npm", "run", "start"]