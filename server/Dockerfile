FROM node:12-alpine

# setup environment variables
ENV ADITO_SERVER_HOST=https://localhost:8443
ENV NODE_SERVER_PORT=5000
ENV DIALOGFLOW_PROJECTID=adito-virtual-assistant-dmvu
ENV DIALOGFLOW_LANGUAGECODE=de

# set working directory
WORKDIR /usr/src/virtualAssistant/server

COPY . ./
RUN npm install --silent

# expose node server port
EXPOSE ${NODE_SERVER_PORT}

# start server
CMD ["npm", "start"]