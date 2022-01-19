FROM node:latest
LABEL MAINTAINER="Spencer-0003"

WORKDIR /syrim

COPY package.json ./
RUN yarn
COPY . .
RUN yarn prisma generate
RUN yarn build

CMD ["yarn", "start"]