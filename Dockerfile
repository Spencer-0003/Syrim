FROM node:17.3.1-alpine3.15
LABEL maintainer="Spencer-0003"

RUN apk add git python3 make g++

WORKDIR /syrim

COPY package.json ./
RUN yarn
COPY . .
RUN yarn prisma generate
RUN yarn build

USER node
CMD ["yarn", "docker:start"]