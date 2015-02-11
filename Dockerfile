# Pull base image.
FROM dockerfile/nodejs-bower-gulp

# Install TypeScript Definition manager for DefinitelyTyped
RUN npm install tsd@next -g

# Install supervisor
RUN npm install supervisor -g

# Install forever
RUN npm install forever -g

WORKDIR /data

ENTRYPOINT ["bash", "./run.sh"]
