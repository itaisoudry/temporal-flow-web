FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:20-alpine

# install tini - to make sure there's init process to cleanup node app
RUN apk add --no-cache tini
ENTRYPOINT [ "/sbin/tini", "--" ]

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 7531

ENV NODE_ENV=production

CMD ["npm", "start"]
