FROM nginx:stable-alpine

COPY prototype-web-transit /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
