# Lab

## Objectives

1. Use `emptyDir` storage
2. Use `hostPath` storage
3. Use PersistentVolume

## Avant de Commencer

On effectue la succession de commande suivante:

```
minikube start
```

```
minikube status
```

## 1. Utilisation du stockage emptyDir

1. On implement un deployment.yml fichier dans le dossier emptyDir:

deployment.yml:
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-empty-dir
  labels:
    app: nginx-empty-dir
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx-empty-dir
  template:
    metadata:
      labels:
        app: nginx-empty-dir
    spec:
      volumes:
        - name: nginx-empty-volume
          emptyDir: {}
      containers:
        - name: nginx-container
          image: nginx
          ports:
            - containerPort: 80
              name: "http-server"
          volumeMounts:
            - name: nginx-empty-volume 
              mountPath: /usr/share/nginx/html
```

2. Puis on excécute la configuration d'un pod:

```
kubectl apply -f lab/emptyDir/deployment.yml
```

3. Enter to a container and `curl` localhost

On va cherche le pod que l'on vient de creer:

```
kubectl get pods
```

et on retient le nom ```nginx-empty-dir-567784fd-8hc22```


on entre dans le conteneur:

```
kubectl exec -it nginx-empty-dir-567784fd-8hc22 bash
```

1 l'interieur du conteneur on run `curl localhost` et on obtient : 
Par défaut de Nginx pointera sur index.html si on ne spécifie pas le nom de fichier on a:

```
<html>
<head><title>403 Forbidden</title></head>
<body>
<center><h1>403 Forbidden</h1></center>
<hr><center>nginx/1.25.3</center>
</body>
</html>
```

4. Nous allons donc maintenant creer un fichier index.html

on effectue la commande : 
```
echo 'Hello from Kubernetes storage!' > /usr/share/nginx/html/index.html
```

pour obtneir une reponse: ```Hello from Kubernetes storage!```

5. Verify

- When a **Pod is removed** from a node for any reason, the data in the `emptyDir` is deleted forever.   
  You can remove a pod using Kubernetes Dashboard that is started with `minikube dashboard` command or `kubectl delete pod/<POD_NAME>`.

- When a **container in a Pod is removed**, Kubernetes will create a new container and will mount the existing `emptyDir` volume to it.   
  Learn the Container ID with the command `kubectl describe pod/<POD_NAME>`. Then you can enter to Minikube Node with `minikube ssh` and manually remove the container with `docker rm -f CONTAINER_ID`.

## 2. Use `hostPath` storage

1. Complete the [`lab/hostPath/deployment.yml`](lab/hostPath/deployment.yml) file.

Use `/mnt/hostPath/` folder as the path on your virtual node file system.

References:
- `hostPath` usage - https://kubernetes.io/docs/concepts/storage/volumes/#hostpath

2. Run a pod applying configuration:

```
kubectl apply -f lab/hostPath/deployment.yml
```

Ensure that `curl localhost` responds with 403 error (step 3 in the previous task).

3. Create `/mnt/hostPath/index.html` file with some content **inside a VM**

Enter the VM with `minikube ssh` command. Then run:

```
sudo mkdir /mnt/hostPath
sudo chmod -R 777 /mnt/hostPath
sudo echo 'Hello from Kubernetes storage!' > /mnt/hostPath/index.html
```

Make sure you have successfully written to file: `cat /mnt/hostPath/index.html`

Run `curl localhost` from the container (not from the VM). It will output:

```
Hello from Kubernetes storage!
```

4. Verify

- When a **Pod is removed** from a node for any reason, the data in the `hostPath` will still remain.
- When multiple replicas of a **Pod** are created, they all bind to the same volume.   
  You can configure many replicas using `spec.replicas` parameter in the deployment configuration yaml file.

## 3. Use PersistentVolume

Reference to this tutorial and reproduce all of the steps - https://kubernetes.io/docs/tasks/configure-pod-container/configure-persistent-volume-storage/
