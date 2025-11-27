# build stage
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# build Angular production
RUN npm run build -- --output-path=dist

# production stage (nginx)
FROM nginx:stable-alpine

# copiar arquivos compilados
COPY --from=build /app/dist/browser /usr/share/nginx/html

# copiar config nginx custom (faz proxy /api -> backend)
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
