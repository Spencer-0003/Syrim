FROM node:17.3.1-alpine3.15
LABEL MAINTAINER="Spencer-0003"

RUN apk add git

WORKDIR /syrim

COPY package.json ./
RUN yarn
COPY . .
RUN yarn prisma generate
RUN yarn build

CMD ["yarn", "docker:start"]