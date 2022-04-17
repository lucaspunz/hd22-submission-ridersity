FROM node:16.14.2-alpine3.15 as base
RUN mkdir /app
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
EXPOSE 5001
CMD ["yarn", "start"]