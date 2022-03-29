# Compiler
FROM node:17.3.1-alpine3.15 as compiler
LABEL maintainer="Spencer-0003"

RUN apk add --no-cache git python3 make g++
WORKDIR /syrim

COPY package.json ./
RUN yarn
COPY . ./
RUN yarn prisma generate && yarn build

# Cleaner
FROM node:17.3.1-alpine3.15 as cleaner
LABEL maintainer="Spencer-0003"

RUN apk add --no-cache git python3 make g++
WORKDIR /syrim

COPY --from=compiler /syrim/package.json ./
COPY --from=compiler /syrim/dist ./dist
COPY --from=compiler /syrim/prisma ./prisma
RUN yarn --production=true

# Runner
FROM node:17.3.1-alpine3.15
LABEL maintainer="Spencer-0003"

RUN apk add --no-cache git
WORKDIR /syrim

COPY --from=cleaner /syrim ./
RUN chown node:node /syrim/node_modules/prisma
USER node

CMD ["yarn", "docker:start"]
