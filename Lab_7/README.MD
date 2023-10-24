# Lab 7

## Auteurs

Alexandre Chauchard
Raphaël Hilt

## Partie 1 - Installer Minikube

On utilise la commande suivante (Mac puce Intel) :

``` bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64
sudo install minikube-darwin-amd64 /usr/local/bin/minikube
```

Puis :

``` bash
minikube start --driver=docker
```

Et finalement : 

``` bash
minikube status pour vérifier que tout est ok
```

Dans notre cas c'est bon.

## Partie 2 - Apprendre à utiliser les commandes `kubectl`

### 2.2 Créer un pod

On créer un déploiement avec un `pod` avec la commande suivante :

``` bash 
kubectl create deployment kubernetes-bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1
```

### 2.3 Lister les pods

On liste les pods qui s'effectuent :

``` bash
kubectl get pods
```

On constate uniquement celui qu'on vient d'ouvir.

### 2.4 Obtenir les logs

On montre les logs avec la commande suivante :

``` bash
kubectl logs kubernetes-bootcamp-855d5cc575-hvwpw
```

Voici le résultat :

``` bash
Kubernetes Bootcamp App Started At: 2023-10-24T07:21:14.113Z | Running On:  kubernetes-bootcamp-855d5cc575-hvwpw 
```

### 2.5 Lancer une commande

On lance ensuite une commande avec cette ligne là :

``` bash
kubectl exec kubernetes-bootcamp-855d5cc575-hvwpw -- cat /etc/os-release
```

voici le résultat :

``` bash
PRETTY_NAME="Debian GNU/Linux 8 (jessie)"
NAME="Debian GNU/Linux"
VERSION_ID="8"
VERSION="8 (jessie)"
ID=debian
HOME_URL="http://www.debian.org/"
SUPPORT_URL="http://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"
```

### 2.6 Ouvrir une Shell dans le pod

On utilise cette ligne :

``` bash
kubectl exec -ti kubernetes-bootcamp-855d5cc575-hvwpw bash
```

### 2.7 Lister les fichiers

On utilise :

``` bash
ls
```

On repère le fichier javaScript `server.js`

### 2.8 Faire une requête pour valider le fonctionement

Avec la ligne suivante on peut trouver le port :

``` bash
cat server.js
```

On fait la requête comme suit :

``` bash
curl http://localhost:8080
```

Et voici le résultat :

``` bash
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-855d5cc575-hvwpw | v=1
```

### 2.9 Requête hors du pod 

Avec la même commande de requête, on n'obtient pas de résultat car on ne peut pas atteindre le port.

## Partie 3 - Apprendre à exposer Kubernetes à l'extérieur

### 3.1 Exposer le déploiement

Nous utilisons la commande suivante :

``` bash
kubectl expose deployments/kubernetes-bootcamp --type="NodePort" --port 8080
```

### 3.2 Trouver le port attaché au service

En utilisant cette commande :

``` bash
kubectl get services
```

Qui renvoie ceci :

``` bash
kubernetes-bootcamp   NodePort    10.104.144.190   <none>        8080:30963/TCP   27s
```

### Partie 3.3 Obtenir l'ip

Avec la commande suivante :

``` bash
minikube ip
```

Et on obtient ; `192.168.49.2`.

### Partie 3.4 Accéder à l'app sur internet

Vu qu'on utilise Docker on créer un tunnel vers le noeux avec cette commande :

``` bash
minikube service kubernetes-bootcamp
```

On voit alors `Hello Kubernetes Bootcamp` sur notre page web


## Partie 4 - Apprendre à changer l'échelle d'un déploiement Kubernetes

### 4.1 Augmenter la taille à 5 pods

On utilise la commande suivante :

``` bash
kubectl scale deployments/kubernetes-bootcamp --replicas=5
```

### 4.2 Vérifier que l'on a bien 5 pods

On utilise cette commande :

``` bash
kubectl get pods
```

Elle renvoie cette fois :

``` bash
NAME                                   READY   STATUS    RESTARTS   AGE
kubernetes-bootcamp-855d5cc575-9znjz   1/1     Running   0          41s
kubernetes-bootcamp-855d5cc575-hvwpw   1/1     Running   0          54m
kubernetes-bootcamp-855d5cc575-l4sds   1/1     Running   0          41s
kubernetes-bootcamp-855d5cc575-rw9wk   1/1     Running   0          41s
kubernetes-bootcamp-855d5cc575-v2bqs   1/1     Running   0          41s
```

### 4.3 Vérifier la page Web

On voit que le nom du pod change.

### 4.4 Réduire à 2 pods

On utilise la commande qui suit :

``` bash
kubectl scale deployments/kubernetes-bootcamp --replicas=2
```

Puis `kubectl get pods` et on voit que :

```bash 
NAME                                   READY   STATUS        RESTARTS   AGE
kubernetes-bootcamp-855d5cc575-9znjz   1/1     Running       0          3m7s
kubernetes-bootcamp-855d5cc575-hvwpw   1/1     Running       0          56m
kubernetes-bootcamp-855d5cc575-l4sds   1/1     Terminating   0          3m7s
kubernetes-bootcamp-855d5cc575-rw9wk   1/1     Terminating   0          3m7s
kubernetes-bootcamp-855d5cc575-v2bqs   1/1     Terminating   0          3m7s
```