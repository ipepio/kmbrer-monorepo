FROM node:18 AS app-build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 2173
CMD ["npm", "run", "preview"]
