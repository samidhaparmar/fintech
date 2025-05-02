# Dockerfile.php
FROM php:apache

# Install PDO-MySQL, MySQLi, and the phpredis extension
RUN apt-get update \
 && pecl install redis \
 && docker-php-ext-enable redis \
 && docker-php-ext-install pdo_mysql mysqli \
 && rm -rf /var/lib/apt/lists/*