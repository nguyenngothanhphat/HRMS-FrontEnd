FROM node:14-alpine as builder

LABEL maintainer="HRMS maintainer"

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

COPY . .

RUN npm run test

RUN npm run build

FROM nginx:1.18.0-alpine

COPY --from=builder /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]