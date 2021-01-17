FROM node:12-alpine
WORKDIR /image-repository
COPY . .
EXPOSE 80
CMD ["npm","start"]