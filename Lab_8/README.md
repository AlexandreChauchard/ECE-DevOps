## Lab 8

## Partie 1 - Utiliser le stockage `emptyDir`

### 1.1 Compléter le fichier `deployement.yaml`

On ajoute le code suivant :

``` yaml
      volumes:
        - name: nginx-empty-dir-volume
          emptyDir: {}
      containers:
      - name: nginx-container
        image: nginx
        ports:
          - containerPort: 80
            name: "http-server"
        volumeMounts:
          - name: nginx-empty-dir-volume
            mountPath: /usr/share/nginx/html
```

### 1.2 Lancer un pod avec la configuration

Avec la commande suivante :

```bash
kubectl apply -f lab/emptyDir/deployment.yml
```

### 1.3 Entrer dans un conteneur et `curl` localhost

Lister les pods :

```bash
kubectl get pods
```

Entrer dans le conteneur :

```bash
kubectl exec -it nginx-empty-dir-5b9db4d986-dlxqv bash
```

On rentre :

```bash
curl localhost
```

On obtient bien :

```html
<html>
  <head>
    <title>403 Forbidden</title>
  </head>
  <body>
    <center><h1>403 Forbidden</h1></center>
    <hr />
    <center>nginx/1.25.3</center>
  </body>
</html>
```

### 1.4 Créer un `ibdex.html`

Depuis le conteneur lancer :

``` bash
echo 'Hello from Kubernetes storage!' > /usr/share/nginx/html/index.html
```

Puis :

``` bash
curl localhost
```

On obtient alors :

``` bash
Hello from Kubernetes storage!
```

### 1.5 Vérifier en cas de délétion

Enlever le pod avec la commande suivante :

``` bash
kubectl delete pod/nginx-empty-dir-5b9db4d986-pqfsk
```

Cela efface le pod. Cependant un nouveau pod est créer pour le remplacer.

On voit que l'on ne peut plus faire le curl. 

Pour le supprimer on récupère son `id` comme ceci :

``` bash
kubectl describe pod/nginx-empty-dir-5b9db4d986-pfk86
```

On obtient ceci :

``` bash
docker://e1205e3cddd8d2e79f7bb4bd1b3d8219392fe6f9a1d3a0365020791e13be4907
```

Finalement on peut l'enlever grâce à la commande suivante :

``` bash
docker rm -f e1205e3cddd8d2e79f7bb4bd1b3d8219392fe6f9a1d3a0365020791e13be4907
```

## Partie 2 - Utiliser le stockage `hostPath`

### 2.1 Modifier `deployement.yaml`

On change le code comme ceci :

``` yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-host-path
  labels:
    app: nginx-host-path
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx-host-path
  template:
    metadata:
      labels:
        app: nginx-host-path
    spec:
      volumes:
      - name: hostpath-volume
        hostPath:
          path: /mnt/hostPath  # Path on the virtual node file system
      containers:
      - name: nginx-container
        image: nginx
        ports:
          - containerPort: 80
            name: "http-server"
        volumeMounts:
        - name: hostpath-volume
          mountPath: /var/www/html  # Mount the volume to this path in the container
```

### 2.2 Créer un pod avec les modifications 

Voici la commande :

``` bash
kubectl apply -f lab/hostPath/deployment.yml
```

Puis on vérifie :

``` bash
kubectl get pods
kubectl exec -it nginx-host-path-668f56fbf5-4sqxj bash
curl localhost
```

Ici on a un fichier `index.html` donc on affiche la bonne page.

