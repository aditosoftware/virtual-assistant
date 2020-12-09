FROM node:12

# set working directory
WORKDIR /usr/src/virtualAssistant/server

# install dependencies
COPY package*.json ./
RUN npm install --silent

# add server
COPY . ./

# expose port 5000
EXPOSE 5000

# start server
CMD ["npm", "start"]