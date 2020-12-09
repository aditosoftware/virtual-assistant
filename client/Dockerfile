FROM node:12

# set working directory
WORKDIR /usr/src/virtualAssistant/client

COPY . ./
RUN npm install --silent

# build app
# target location of /build specified in package.json (https://stackoverflow.com/questions/41495658/use-custom-build-output-folder-when-using-create-react-app)
RUN npm run build