FROM node:18
RUN mkdir /next
WORKDIR /next
RUN yarn set version stable

COPY ./ /next/
RUN yarn build