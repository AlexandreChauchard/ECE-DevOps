# Lab 4

## Partie 1 - Intégration continue avec Github Actions

On créer le dossier `.github` avec un sous-dossier `workflows` auquel on ajoute `build.yml`.

On ajoute ensuite le code suiuvant :

``` yml
# This workflow will do a clean installation of node dependencies, cache/restore them, build the source code and run tests across different versions of node
# For more information see: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs

name: Node.js CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  CI:

    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: userapi # This is lab3 on root of the repository. 

    strategy:
      matrix:
        node-version: [16.x] # Only one version to not use resources and go faster
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/
        redis-version: [6]
        
    steps:
    - uses: actions/checkout@v3

    # Redis
    - name: Start Redis
      uses: supercharge/redis-github-action@1.4.0
      with:
        redis-version: ${{ matrix.redis-version }}

    # Nodejs
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
        cache-dependency-path: 'userapi/package-lock.json'
    - run: npm ci # Similar to npm install but for CI. Doesn't rely on the package.json for dependency resolution; instead, it uses the package-lock.
    - run: npm run build --if-present
    - run: npm test
```

Lorsque l'on fait un `push` tout nos tests sont effectués et validés.

Au premier abord `redis` ne fonctionne pas c'est pour cela qu'on utilise du code pour activer redis.

## Partie 2 - Livraison continue avec Azure

Nous suivons le tutoriel et déployons notre application sans problème. Rien à rajouter ici.