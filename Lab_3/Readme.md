# LAB 3

## Partie 1. Utiliser l'API utilisateur déjà préparée.

### 1.1 Installation et tests

En premier lieu il faut avoir installer NodeJS ainsi que Redis database.

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

Activer la database Redis :

``` CLI
redis-server
```     

Puis 

``` CLI
redis-cli ping
```

Qui doit générer le message suivant :

``` CLI
pong
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

#### Le premier ajout est celui empêchant de créer un utilisateur s'il existe déjà.

Pour ce faire on modifie dans un premier lieu le fichier `src/controllers/user.js` en ajoutant le code suivant :

```javascript
   db.hgetall(user.username, function(err, res) {
      if (err) return callback(err, null)
      if (!res) {
        // Save to DB
        db.hmset(user.username, userObj, (err, res) => {
          if (err) return callback(err, null)
          callback(null, res) // Return callback
        })
      } else {
        callback(new Error("User already exists"), null)
      }
    })
```

Ce code retourne une erreur si `username` existe déjà dans la DB. Sinon le code continue normalement et créer le nouvel utilisateur.

Il faut ensuite ajouter le test dans le fichier `test/user.controller.js` grâce au code suivant :

```javascript
      it('avoid creating an existing user', (done)=> {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      // Create a user
      userController.create(user, () => {
        // Create the same user again
        userController.create(user, (err, result) => {
          expect(err).to.not.be.equal(null)
          expect(result).to.be.equal(null)
          done()
        })
      })
    })
```
Si on test la requête grâce au code de la partie 1.2 avec un utilisateur existant, on obtient alors : 

``` CLI
{"status":"error","msg":"User already exist"}
```

On voit le bon message d'erreur correspondant. De plus, avec le script `test`, les 8 tests sont bien validés.

#### Le prochain ajout sera celui qui empêche la fonction `get` quand l'utilisateur n'existe pas.

On ajoute d'abord dans `src/controllers/user.js` le code suivant permettant de vérifier qu'un utilisateurs n'existe pas.

``` javascript
  get: (username, callback) => {
    if (!username)
      return callback(new Error("Username must be provided"), null);
    db.hgetall(username, function (err, res) {
      if (err) return callback(err, null);
      if (res) callback(null, res);
      else callback(new Error("User doesn't exists"), null);
    });
  },
```

Ce code retourne une erreur si l'utilisateur n'existe pas.

On ajoute ensuite le test dans `test/user.controller.js` afin de vérifier que tout fonctionne.

Voici le code :

``` javascript
it("can not get a user when it does not exist", (done) => {
      userController.get("invalid", (err, result) => {
        expect(err).to.not.be.equal(null);
        expect(result).to.be.equal(null);
        done();
      });
    });
```

Ici, l'username n'existe pas donc on reçoit une erreur et aucun résultat. Les conditions sont remplies.

#### Fonction `get` d'un utilisateur par son `username`.

Ici on veut obtenir un utilisateur grâce à son `username`. On utilise la même fonction `get` dans `src/controllers/user.js`.

Pour le test voici le code : 

``` javascript
it("get a user by username", (done) => {
      const user = {
        username: "sergkudinov",
        firstname: "Sergei",
        lastname: "Kudinov",
      };
      // Create a user
      userController.create(user, () => {
        // Get an existing user
        userController.get(user.username, (err, result) => {
          expect(err).to.be.equal(null);
          expect(result).to.be.deep.equal({
            firstname: "Sergei",
            lastname: "Kudinov",
          });
          done();
        });
      });
    });
```

### 2.2 Créer la methode `GET` avec `REST API`

En premier lieu on modifie le code du fichier `src/routes:user.js` avec le code suivant :

``` javascript
const express = require('express')
const userController = require('../controllers/user')

const userRouter = express.Router()

userRouter
  .post('/', (req, resp) => {
    userController.create(req.body, (err, res) => {
      let respObj
      if(err) {
        respObj = {
          status: "error",
          msg: err.message
        }
        return resp.status(400).json(respObj)
      }
      respObj = {
        status: "success",
        msg: res
      }
      resp.status(201).json(respObj)
    })
  })
  .get('/:username', (req, resp, next) => { // Express URL params - https://expressjs.com/en/guide/routing.html
    // TODO Create get method API
    const username = req.params.username
    userController.get(username, (err, res) => {
      let respObj
      if(err) {
        respObj = {
          status: "error",
          msg: err.message
        }
        return resp.status(400).json(respObj)
      }
      respObj = {
        status: "success",
        msg: res
      }
      resp.status(200).json(respObj)
    })
  })
  
module.exports = userRouter
```

Et on modifie le code du fichier `test/user.router.js` en ajoutant le code suivant :

``` javascript
describe('GET /user', () => {
    
    it('get an existing user', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      // Create a user
      userController.create(user, () => {
        // Get the user
        chai.request(app)
          .get('/user/' + user.username)
          .then((res) => {
            chai.expect(res).to.have.status(200)
            chai.expect(res.body.status).to.equal('success')
            chai.expect(res).to.be.json
            done()
          })
          .catch((err) => {
             throw err
          })
      })
    })
    
    it('can not get a user when it does not exis', (done) => {
      chai.request(app)
        .get('/user/invalid')
        .then((res) => {
          chai.expect(res).to.have.status(400)
          chai.expect(res.body.status).to.equal('error')
          chai.expect(res).to.be.json
          done()
        })
        .catch((err) => {
           throw err
        })
    })
  })
```

Ceci correspond aux test API. 
