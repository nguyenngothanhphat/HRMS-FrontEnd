FROM nginx:1.18.0-alpine

LABEL maintainer="HRMS maintainer"

WORKDIR /usr/share/nginx/html

#COPY package.json ./

#COPY dist/* ./

COPY dist/ ./

#RUN npm i

#RUN npm run test

#RUN npm run build

#COPY --from=builder /usr/src/app/build /usr/share/nginx/html

#EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]