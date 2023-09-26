# LAB 3

## Partie 1. Utiliser l'API utilisateur déjà préparée.

### 1.1 Installation et tests

En premier lieu il faut avoir installer NodeJS ainsi que Redis databse.

Node : https://nodejs.org/en/download
Redis : https://redis.io/download/

Il faut ensuite installer l'application.

Pour cette étape il faut d'abord se rendre dans le dossier du lab.

Installer l'application :

```CLI
npm install
```

Faire les tests grâce au script `test` :

```CLI
npm test
```

le résultat sera le suivant :

```CLI
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

```CLI
npm start
```

On pourra alors ouvrir notre application web grâce au lien suivant : http://localhost:3000

### 1.2 Créer un utilisateur

On peut créer un nouvel utilisateur dans notre Databse grâce à la commande suivante :

```CLI
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username":"sergkudinov","firstname":"sergei","lastname":"kudinov"}' \
  http://localhost:3000/user
```

Il suffit de remplacer les champs `username`, `firstname` et `lastname`.

## Partie 2. Utiliser TDD pour créer la fonctionnalité GET user.

### 2.1 Créer get user controller

Pour créer cette fonction il faut d'abord faire plusieurs ajouts.

Le premier ajout est celui empêchant de créer un utilisateur s'il existe déjà.

Pour ce faire on modifie dans un premier lieu le fichier `src/user.js` en ajoutant le code suivant :

```javascript
    db.exists(user.username, (err, exist) => {
      if (err) {
        return callback(err, null);
      }
      if (exist) {
        return callback(new Error("User already exist"), null);
      }
    });
```

Ce code retourne une erreur si `username` existe déjà dans la DB. Sinon le code continue normalement et créer le nouvel utilisateur.

Il faut ensuite ajouter le test dans le fichier `test/user.controller.js` grâce au code suivant :

```javascript
    it("avoid creating an existing user", (done) => {
      const user = {
        username: "sergkudinov",
        firstname: "Sergei",
        lastname: "Kudinov",
      };
      userController.create(user, (err, result) => {
        expect(err).to.be.equal(null);
        expect(result).to.not.be.equal(null);
        done();
      });
    });
```
Si on test la requête grâce au code de la partie 1.2 avec un utilisateur existant, on obtient alors : 

``` CLI
{"status":"error","msg":"User already exist"}
```

On voit le bon message d'erreur correspondant. De plus, avec le script `test`, les 8 tests sont bien validés.
