FROM node:14-alpine as builder

WORKDIR /home/node/app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

COPY client ./client
COPY server ./server
COPY shared ./shared

RUN yarn install --pure-lockfile --non-interactive
RUN yarn build

FROM node:14-alpine

WORKDIR /home/node/app

COPY package.json .
COPY yarn.lock .
COPY server/config server/config

COPY --from=builder /home/node/app/shared/package.json /home/node/app/shared/package.json
COPY --from=builder /home/node/app/shared/dist /home/node/app/shared/dist

COPY --from=builder /home/node/app/server/package.json /home/node/app/server/package.json
COPY --from=builder /home/node/app/server/dist /home/node/app/server/dist
COPY --from=builder /home/node/app/server/public /home/node/app/server/public

ENV NODE_ENV production
ENV HOST ""
ENV PORT 8080

RUN yarn install --pure-lockfile --non-interactive --production

WORKDIR /home/node/app/server

RUN mkdir logs data
RUN chown -R node:node /home/node/app

EXPOSE 8080

VOLUME [ "/home/node/app/server/data", "/home/node/app/server/logs" ]

USER node

CMD ["node", "dist/src/app.js"]