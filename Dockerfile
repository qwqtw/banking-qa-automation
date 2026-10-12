FROM mcr.microsoft.com/playwright:v1.64.0-noble
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY banking-ui/package*.json ./banking-ui/

RUN cd banking-ui && npm ci

COPY . .

CMD ["npx", "playwright", "test"]