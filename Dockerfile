FROM node

ENV HOME=/usr/src/app
RUN mkdir $HOME
WORKDIR $HOME
COPY ./ $HOME

RUN npm install -g --loglevel error angular-cli && npm install --loglevel error

EXPOSE 4200
EXPOSE 49153
