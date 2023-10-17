# Lab 1 

### Author : Alexandre Chauchard

## Installation 

Installer un IDE comme par exemple : `Vs Code`.\
Installer : `Node.js`

### Partie 1 - Commencer un projet

En utilisant les commandes `CLI` suivantes, nous allons créer un dossier et initialiser github.

``` bash
cd ~/path/to/your-root-project-directory
mkdir myschool-devops-myproject
cd myschool-devops-myproject
git init
```

### Partie 2 - Initialiser le package Node.js

On utilise la commande suivante pour initialiser node :

``` bash
npm init -y
```

Grâce à cela, on créer le fichier `package.json`.

On run ensuite le script test :

```bash
npm run test
```

Cela lancera le script `"echo \"Error: no test specified\" && exit 1"` défini dans `package.json`. La chaîne de sortie sera : `no test specified`.

## Partie - 3 Créer un projet Node.js

Maintenant nous allons créer un projet avec `Node.js`.

On créer le fichier `index.js` :

``` javascript
str = "Hello Node.js!"
console.log(str)
```

On utilise ensuite le script suivant : 

``` BASH
node index.js
```

Cela affichera `Hello Node.js!`.

On défini cette commande en tant que script dans le fichier `package.json` :

``` json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node index.js"
  },
```

On peut maintenant run notre code avec la commande suivante :

``` bash
npm run start
 #
npm start
```

## Partie 4 - Créer une application web en utilisant Express

On installe `Express` :

``` bash
npm install express
```

On remarque la nouvelle dépendance dans le fichier `package.json` :

``` json
"dependencies": {
    "express": "^4.17.1"
  }
```

On modifie ensuite le fichier `index.js` avec le code suivant :

``` javascript
const express = require('express')

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello world!')
})

module.exports = app.listen(port, (err) => {
  if (err) throw err
  console.log("Server listening the port " + port)
})
```

On utilise `npm start` pour lancer le projet.

## Partie 5 - Créer un fichier `CHANGELOG.md`

On créer un fichier `CHANGELOG.md` que l'on initialise comme suit :

``` md
# Changelog

## Unreleased

### Added

- Create an HTTP web server using Express
- Initialize a project
```

