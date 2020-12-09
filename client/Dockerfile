FROM node:12

# set working directory
WORKDIR /usr/src/virtualAssistant/client

COPY . ./
RUN npm install --silent

# build app
RUN npm run build