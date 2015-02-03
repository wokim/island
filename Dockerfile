# Base on https://github.com/wokim/nodejs-bower-gulp-tsd

# Pull base image.
FROM wokim/nodejs-bower-gulp-tsd

WORKDIR /data

# Update npm
RUN curl -L https://npmjs.com/install.sh | sh

# Define default command.
ENTRYPOINT npm run build
CMD npm start