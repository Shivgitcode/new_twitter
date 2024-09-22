FROM node:22-alpine

WORKDIR /app

COPY . .

RUN npm install
RUN npx prisma generate
RUN npm install -g typescript


EXPOSE 7000

CMD [ "npm","run","dev" ]