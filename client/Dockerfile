FROM node:12

# set working directory
WORKDIR /usr/src/virtualAssistant/client

COPY . ./
RUN npm install --silent

# build app
RUN npm run build

# remove unused files
RUN rm -rf node_modules
RUN rm -rf public
RUN rm -rf src