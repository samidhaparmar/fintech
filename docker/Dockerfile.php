# Dockerfile.php
FROM php:apache

# Install PDO-MySQL, MySQLi, and the phpredis extension
RUN apt-get update \
 && pecl install redis \
 && docker-php-ext-enable redis \
 && docker-php-ext-install pdo_mysql mysqli \
 && rm -rf /var/lib/apt/lists/*

 # 1) Install PHP-extensions + ModSecurity build tools
RUN apt-get update && \
apt-get install -y --no-install-recommends \
  git                    \
  gcc                    \
  make                   \
  libxml2-dev            \
  libpcre2-dev           \
  libcurl4-openssl-dev   \
  libapache2-mod-security2 \
  pkg-config libtool autoconf automake    && \
# pecl install redis && docker-php-ext-enable redis && \
docker-php-ext-install pdo_mysql mysqli && \
rm -rf /var/lib/apt/lists/*

# 2) Clone & build ModSecurity v3
RUN git clone --depth 1 https://github.com/SpiderLabs/ModSecurity /opt/ModSecurity && \
cd /opt/ModSecurity && \
git submodule init && \
git submodule update && \
./build.sh && \
./configure && \
make && \
make install

# 3) Install OWASP Core Rule Set
RUN git clone --depth 1 https://github.com/coreruleset/coreruleset /etc/modsecurity-crs && \
cp /etc/modsecurity-crs/crs-setup.conf.example /etc/modsecurity-crs/crs-setup.conf

# 4) Enable the Apache security2 module
RUN a2enmod security2

# Suppress FQDN warning by setting a global ServerName
RUN echo "ServerName localhost" > /etc/apache2/conf-available/servername.conf && \
    a2enconf servername

# 5) Copy your ModSecurity config into place
COPY modsecurity.conf /etc/apache2/mods-enabled/security2.conf