# Lab 6

## Partie 1 - Installation de Docker

Voici le lien d'installation : https://www.docker.com/get-started/

On peut utiliser la commande suivante pour vérifier le fonctionnement :

``` bash
docker run hello-world
```

## Partie 2 - Ecrire un fichier Docker et construire une Image

Ici on va build notre première image. On se rend dans le ficher `Hello-world-docker` et on utilise la commande suivante :

``` bash
docker build -t hello-world-docker .
```

Puis :

``` bash
docker image
```

On voit que notre conteneur apparaît bien.

## Partie 3 - Créer un conteneur docker avec plusieurs options

On utilise la commande suivante :

``` bash
docker run -p 12345:8080 -d hello-world-docker
```

Un nouveau conteneur apparaît sur `Docker desktop`.

id : `f3c151a750e1`

On vérifie que tout est bon avec :

``` bash
docker ps
```

On ouvre ensuite `http://localhost:12345`.

On voit une page web avec écris : `Hello World from Docker!`.

On utilise la commande qui suit pour voir les logs :

``` bash
docker logs f3c151a750e1
```

Voici ce que l'on récupère :

``` bash
> hello_world_docker@1.0.0 start /usr/src/app
> node server.js

Running on http://localhost:8080
```

Finalement on stop le conteneur avec la commande :

``` bash
docker stop f3c151a750e1
```

On constate sur `Docker desktop` que le conteneur est éteint.

## Partie 4 - Partager un conteneur

D'abord on tag notre conteneur comme suit :

``` bash
docker tag hello-world-docker tiquetou/hw
```

Ensuite : 

``` bash
docker login
```

Puis :

``` bash
docker push tiquetou/hw
```

Enfin on voit que le conteneur est présent sur `Docker Hub`.

## Partie 5 - Créer et lancer plusieurs conteneur avec Docker Compose

On se rend dans le fichier `Hello-world-docker-compose`.

On build le conteneur avec la ligne suivante :

``` bash
docker build -t hello-world-docker-compose .
```

On modifie le fichier `docker-compose.yaml` comme suit :

``` yaml
version: '3.3'

services:
   db:
     image: mysql:5.7
     volumes:
       - db_data:/var/lib/mysql
     restart: always
     environment:
       MYSQL_ROOT_PASSWORD: somewordpress
       MYSQL_DATABASE: wordpress
       MYSQL_USER: wordpress
       MYSQL_PASSWORD: wordpress

   wordpress:
     depends_on:
       - db
     image: wordpress:latest
     ports:
       - "5000:8000"
     restart: always
     environment:
       WORDPRESS_DB_HOST: db:3306
       WORDPRESS_DB_USER: wordpress
       WORDPRESS_DB_PASSWORD: wordpress
       WORDPRESS_DB_NAME: wordpress
volumes:
    db_data: {}
```

Puis on le lance avec :

``` bash
docker-compose up
```

On voit de nombreux logs à chaque rechargement de page.

Finalement on supprime le conteneur :

``` bash
docker-compose rm
```

Dernièrement, si on recharge et re-stop le conteneur on voir que le compte à été réinitialisé.