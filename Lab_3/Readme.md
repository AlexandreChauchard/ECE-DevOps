# LAB 3

## Partie 1. Utiliser l'API utilisateur déjà préparée.

### 1.1 Installation et tests

En premier lieu il faut avoir installer NodeJS ainsi que Redis databse. 

Node : https://nodejs.org/en/download
Redis : https://redis.io/download/

Il faut ensuite installer l'application.

Pour cette étape il faut d'abord se rendre dans le dossier du lab.

Installer l'application :

``` CLI
npm install
```

Faire les tests grâce au script `test` :

``` CLI
npm test
```

le résultat sera le suivant :

``` CLI
  Configure
    ✔ load default json configuration file
    ✔ load custom configuration

  Redis
    ✔ should connect to Redis

  User
    Create
      ✔ create a new user
      ✔ passing wrong user parameters

  User REST API
    POST /user
      ✔ create a new user
      ✔ pass wrong parameters

  7 passing (73ms)
```

Finalement lancer l'application avec le script `start` :


``` CLI 
npm start
```

On pourra alors ouvrir notre application web grâce au lien suivant : http://localhost:3000

### 1.2 Créer un utilisateur

On peut créer un nouvel utilisateur dans notre Databse grâce à la commande suivante :

``` CLI
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username":"sergkudinov","firstname":"sergei","lastname":"kudinov"}' \
  http://localhost:3000/user
```

Il suffit de remplacer les champs `username`, `firstname` et `lastname`.
