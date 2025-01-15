# Helpers
IS_DARWIN := $(filter Darwin,$(shell uname -s))

define set_env
	sed $(if $(IS_DARWIN),-i "",-i) -e "s/^#*\($(1)=\).*/$(if $(2),,#)\1$(2)/" .env
endef

EXEC := docker-compose exec main

# Environment recipes
.PHONY: default
default: init up

.PHONY: init
init:
	test -f .env || cp .env.example .env
	$(call set_env,USER_ID,$(shell id -u))

.PHONY: up
up:
	DOCKER_BUILDKIT=1 docker-compose up -d --build
	$(EXEC) npm run build

.PHONY: down
down:
	docker-compose down

.PHONY: shell
shell:
	$(EXEC) zsh

# Project recipes
.PHONY: deps
deps:
	$(EXEC) npm ci

.PHONY: run
run:
	$(EXEC) npm run develop

.PHONY: start
start:
	$(EXEC) npm run start

.PHONY: debug
debug:
	$(EXEC) npm run debug

.PHONY: restore_bbdd
restore_bbdd:
	@echo "Renombrando script_inicial.2sql a script_inicial.sql..."
	@cp script_inicial.2sql script_inicial.sql
	@echo "Restaurando la base de datos en el contenedor PostgreSQL..."
	@cat script_inicial.sql | docker exec -i kmbrer_postgres_1 psql -U postgres -d postgres
	@echo "Base de datos restaurada correctamente."
	@rm script_inicial.sql
	@echo "Archivo temporal script_inicial.sql eliminado."

