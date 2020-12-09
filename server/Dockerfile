FROM node:12

# set working directory
WORKDIR /usr/src/virtualAssistant/server

COPY . ./
RUN npm install --silent

# expose port 5000
EXPOSE 5000

# start server
CMD ["npm", "start"]