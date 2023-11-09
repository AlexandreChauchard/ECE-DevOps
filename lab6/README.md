# Lab 6 by Raphael HILT

Containers with Docker

## Objectives 

1. Install Docker
2. Write a `Dockerfile` and build a Docker image
3. Run a Docker container with multiple options
4. Share your Docker container with a classmate
5. Build and run a multiple container app with Docker Compose


## 1. Installer Docker

Pour installer Docker on doit utiliser la commande: 
```
docker run hello-world
```
et on recoit en retour ce message: 
```Hello from Docker!```

## 2. Écrire un fichier Docker et construire une image Docker

Afin de construire une image docker on creer un fichier nommé hello-world-docker dans lequel on met ces fichier:

server.js: 
```
'use strict';

const express = require('express');

const PORT = 8080;

const app = express();
app.get('/', (req, res) => {
  res.send('Hello World from Docker!');
});

app.listen(PORT);
console.log(`Running on http://localhost:${PORT}`);
```
package.json:
```
{
    "name": "hello_world_docker",
    "version": "1.0.0",
    "description": "Node.js on Docker",
    "main": "server.js",
    "scripts": {
      "start": "node server.js"
    },
    "dependencies": {
      "express": "^4.16.1"
    }
  }
```

et Dockerfile:
```
FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
```

on rentre ensuite dans le terminale en se situant dans le dossier hello-worold-docker
``` 
docker build -t hello-world-docker .
```

Afin de vérifier si notre docker apparait dans les image docker local on utilise la commande: 
```
docker images
```

qui nous sort:
```
hello-world-docker            latest    9b0515d0a34a   13 minutes ago   869MB
```

## 3. Executer un conteneur Docker avec plusieurs options

la première commande est :
```docker run -p 12345:8080 -d hello-world-docker```
ce qui nous retourne :
```abc1e6f88a0d40ccb7da7a86f60c055cf5bb1bf9a75553a7d898aab08a824f6b```