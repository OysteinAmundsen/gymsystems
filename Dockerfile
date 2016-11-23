FROM node

ENV HOME=/usr/src/app
RUN mkdir $HOME
WORKDIR $HOME
COPY ./ $HOME

RUN npm install -g angular-cli && npm install

EXPOSE 4200
EXPOSE 49153
