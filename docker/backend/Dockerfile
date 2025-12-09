# Composer
FROM composer:2.8.11 AS composer

# php
FROM php:8.4-fpm

WORKDIR /var/www/app

# php dependencies
RUN apt-get update
RUN apt-get install -y unzip libzip-dev ffmpeg libpq-dev

RUN docker-php-ext-install bcmath zip pgsql pdo_pgsql pcntl

RUN pecl install redis && docker-php-ext-enable redis

ARG ENABLE_XDEBUG=false
RUN if [ ${ENABLE_XDEBUG} = true ]; then \
        pecl install xdebug-3.4.5 && \
        docker-php-ext-enable xdebug && \
        echo "xdebug.mode=develop,debug,coverage" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
        echo "xdebug.start_with_request=yes" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini && \
        echo "xdebug.client_host=host.docker.internal" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
;fi

# Make composer accessible
COPY --from=composer /usr/bin/composer /usr/bin/composer

