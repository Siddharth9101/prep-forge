FROM ghcr.io/puppetehttps://prep-forge.onrender.comer/puppeteer:24.40.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
CMD [ "node", "server.js" ]