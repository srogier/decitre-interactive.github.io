.PHONY: \
	install \
	clean \
	docker-up \
	docker-build \
	docker-clean \
	force-docker-build \
	docker-bash \


CURRENT_UID=$(shell id -u)
CURRENT_GID=$(shell id -g)

# installe les dépendances du projet
install: \
	composer.phar \
	tools/vendor \

composer.phar:
	$(eval EXPECTED_SIGNATURE = "$(shell wget -q -O - https://composer.github.io/installer.sig)")
	$(eval ACTUAL_SIGNATURE = "$(shell php -r "copy('https://getcomposer.org/installer', 'composer-setup.php'); echo hash_file('SHA384', 'composer-setup.php');")")
	@if [ "$(EXPECTED_SIGNATURE)" != "$(ACTUAL_SIGNATURE)" ]; then echo "Invalid signature"; exit 1; fi
	php composer-setup.php
	rm composer-setup.php

tools/vendor: composer.phar
	php composer.phar install -d tools

# nettoie les dépendances du projet
clean:
	test -f composer.phar && rm composer.phar || true
	test -d tools/vendor && rm -rf tools/vendor || true

# initialise l'environnement de dev
docker-build: \
	docker-compose.override.yml \
	.docker-build \


# nettoie l'environnement de dev
docker-clean:
	test -f .docker-build && rm .docker-build || true
	test -d docker/data && rm -rf docker/data || true

force-docker-build: \
	docker-clean \
	docker-build \

# lance un bash sur l'env de dev
docker-bash:
ifeq ($(COMMAND), ) # pour tester que COMMAND n'est pas défini
	docker-compose run --user localUser --rm php /bin/bash
else
	docker-compose run --user localUser --rm php /bin/bash -c "$(COMMAND)"
endif

# démarre l'env de dev
docker-up: docker-build
	if [ $(daemon) ]; then docker-compose up -d; else docker-compose up; fi


## commandes du build docker
docker-compose.override.yml:
	cp docker-compose.override.yml-dist docker-compose.override.yml

.docker-build: \
	docker-compose.yml \
	docker-compose.override.yml \
	$(shell find docker/conf -type f)
	docker-compose rm --force
	CURRENT_UID=$(CURRENT_UID) CURRENT_GID=$(CURRENT_GID) docker-compose build
	touch .docker-build
