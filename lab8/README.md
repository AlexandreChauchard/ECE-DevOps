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

Afin de verifier que lorsqu'un Pod est supprimé d'un nœud pour une raison quelconque, les données contenues dans le `emptyDir` sont supprimées à jamais.   

Pou ce faire, nous commencons par supprimer un pod en utilisant 
```
kubectl delete pod/nginx-empty-dir-567784fd-8hc22
```

voici le nouveau pod crée: `nginx-empty-dir-567784fd-6p2zl`

on effectue les même commandes précédente afin de voir si le fichier index.html a bien disparu:
```
kubectl exec -it nginx-empty-dir-567784fd-6p2zl bash
```

puis `curl localhost`

```
<html>
<head><title>403 Forbidden</title></head>
<body>
<center><h1>403 Forbidden</h1></center>
<hr><center>nginx/1.25.3</center>
</body>
</html>
```

Verifions maintenant que lorsqu'un conteneur d'un pod est supprimé, Kubernetes crée un nouveau conteneur et y monte le volume `emptyDir` existant. 

on va chercher l'ID du conteneur avec la commande: 
```
kubectl describe pod/nginx-empty-dir-567784fd-6p2zl
```

on obtient cette réponse: 
```
Name:             nginx-empty-dir-567784fd-6p2zl
Namespace:        default
Priority:         0
Service Account:  default
Node:             minikube/192.168.49.2
Start Time:       Thu, 16 Nov 2023 12:42:47 +0100
Labels:           app=nginx-empty-dir
                  pod-template-hash=567784fd
Annotations:      <none>
Status:           Running
IP:               10.244.0.26
IPs:
  IP:           10.244.0.26
Controlled By:  ReplicaSet/nginx-empty-dir-567784fd
Containers:
  nginx-container:
    Container ID:   docker://204471e1604ef7096a2c6bb7c351dca078036592d76f57294fd0f39cdaa942fd
    Image:          nginx
    Image ID:       docker-pullable://nginx@sha256:86e53c4c16a6a276b204b0fd3a8143d86547c967dc8258b3d47c3a21bb68d3c6
    Port:           80/TCP
    Host Port:      0/TCP
    State:          Running
      Started:      Thu, 16 Nov 2023 12:42:49 +0100
    Ready:          True
    Restart Count:  0
    Environment:    <none>
    Mounts:
      /usr/share/nginx/html from nginx-empty-volume (rw)
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-cn9kz (ro)
Conditions:
  Type              Status
  Initialized       True 
  Ready             True 
  ContainersReady   True 
  PodScheduled      True 
Volumes:
  nginx-empty-volume:
    Type:       EmptyDir (a temporary directory that shares a pod's lifetime)
    Medium:     
    SizeLimit:  <unset>
  kube-api-access-cn9kz:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3607
    ConfigMapName:           kube-root-ca.crt
    ConfigMapOptional:       <nil>
    DownwardAPI:             true
QoS Class:                   BestEffort
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
```

avec pour Conteneur ID : `docker://204471e1604ef7096a2c6bb7c351dca078036592d76f57294fd0f39cdaa942fd`

on accede au noeud minikube avec:
```
minikube ssh
```
et on supprime le conteneur
```
docker rm -f 204471e1604ef7096a2c6bb7c351dca078036592d76f57294fd0f39cdaa942fd
```

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





kubectl exec -it nginx-empty-dir-567784fd-6p2zl bash


docker rm -f 204471e1604ef7096a2c6bb7c351dca078036592d76f57294fd0f39cdaa942fd