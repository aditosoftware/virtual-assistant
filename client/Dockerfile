FROM nginx:alpine
EXPOSE 80

COPY ./ /var/www/app
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./start.sh /start.sh

RUN apk add npm
ENV URL=http://localhost:80/api/

WORKDIR /var/www/app
RUN npm install --silent
RUN npm run build

WORKDIR /var/www/
RUN mkdir react/
RUN mv app/build/* react/
RUN rm app/ -Rf
RUN rm /root/.npm/ -Rf
RUN apk del c-ares libgcc libstdc++ libuv nodejs npm

CMD /start.sh






