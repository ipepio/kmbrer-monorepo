# Etapa 1: Construcción
FROM node:18 AS app-build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3173
CMD ["npm", "run", "preview"]
# CMD ["pnpm", "run", "preview", "--port", "4173"]
