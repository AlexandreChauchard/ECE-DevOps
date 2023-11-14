# Lab 9

## Partie 1 - Départ rapide avec Istio

Aller sur le site suivant : https://istio.io/latest/docs/setup/getting-started/

Prérequis : Minikube et Kubernetes.

### 1.1 Télécharger Istio

Utiliser la commande suivante dans le terminal (sur le bureau) :

```bash
curl -L https://istio.io/downloadIstio | sh -
```

Utiliser la commande suivante depuis le dossier `Istio` sur le bureau :

```bash
export PATH=$PWD/bin:$PATH
```

### 1.2 Installer Istio

Utiliser la commande suivante pour l'installation :

```bash
istioctl install --set profile=demo -y
```

Ensuite on ajoute un namespace comme ceci :

```bash
kubectl label namespace default istio-injection=enabled
```

### 1.3 Deployer l'application exemple

On utilise cette commande :

```bash
kubectl apply -f samples/bookinfo/platform/kube/bookinfo.yaml
```

On récupère les services :

```bash
kubectl get services

NAME          TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
details       ClusterIP   10.101.194.142   <none>        9080/TCP   26s
kubernetes    ClusterIP   10.96.0.1        <none>        443/TCP    15m
productpage   ClusterIP   10.101.50.84     <none>        9080/TCP   26s
ratings       ClusterIP   10.100.229.62    <none>        9080/TCP   26s
reviews       ClusterIP   10.107.60.94     <none>        9080/TCP   26s
```

Puis les pods :

```bash
kubectl get pods

NAME                             READY   STATUS            RESTARTS   AGE
details-v1-5f4d584748-v5nmj      2/2     Running           0          62s
productpage-v1-564d4686f-slsnw   0/2     PodInitializing   0          61s
ratings-v1-686ccfb5d8-rt2g2      2/2     Running           0          62s
reviews-v1-86896b7648-cqhcx      0/2     PodInitializing   0          62s
reviews-v2-b7dcd98fb-7srkt       0/2     PodInitializing   0          62s
reviews-v3-5c5cc7b6d-zqjch       0/2     PodInitializing   0          61s
```

Une fois que tout les pods sont à `2/2 Running`, on vérifie avec cette commande que l'on récupère bien le titre de de la page :

```bash
kubectl exec "$(kubectl get pod -l app=ratings -o jsonpath='{.items[0].metadata.name}')" -c ratings -- curl -sS productpage:9080/productpage | grep -o "<title>.*</title>"
```

On obtient :

```bash
<title>Simple Bookstore App</title>
```

## 1.4 Ouvrir l'application hors du traffic

Associé l'application à Iscio :

```bash
kubectl apply -f samples/bookinfo/networking/bookinfo-gateway.yaml

gateway.networking.istio.io/bookinfo-gateway created
virtualservice.networking.istio.io/bookinfo created
```

S'assurer qu'il n'y a pas de problèmes :

```bash
istioctl analyze

✔ No validation issues found when analyzing namespace: default.
```

Suivez ces instructions pour définir les variables INGRESS_HOST et INGRESS_PORT afin d'accéder à la passerelle. Utilisez les onglets pour choisir les instructions correspondant à votre plateforme choisie :

Exécutez cette commande dans une nouvelle fenêtre de terminal pour démarrer un tunnel Minikube qui redirige le trafic vers votre Istio Ingress Gateway. Cela fournira un équilibreur de charge externe, EXTERNAL-IP, pour le service/istio-ingressgateway.

```bash
minikube tunnel
```

puis :

```bash
export INGRESS_HOST=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
export INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].port}')
export SECURE_INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="https")].port}')

```

Finalement on s'assure  que tout fonctionne :

``` bash
echo "$INGRESS_HOST"

127.0.0.1
```

``` bash
echo "$INGRESS_PORT"

80
```

``` bash 
echo "$SECURE_INGRESS_PORT"

443
```

Set GATEWAY_URL: 

``` bash
export GATEWAY_URL=$INGRESS_HOST:$INGRESS_PORT
```

Vérifier que tout est bon :

``` bash
echo "$GATEWAY_URL"

127.0.0.1:80
```

Finalement, on vérifie l'accès externe :

``` bash
    echo "http://$GATEWAY_URL/productpage"

http://127.0.0.1:80/productpage
```

On utilise l'url sur navigateur pour vérifier et on voit bien une page sur des livres.

### 1.5 Visualiser le dashboard 

Istio s'intègre à plusieurs applications de télémétrie différentes. Celles-ci peuvent vous aider à comprendre la structure de votre maillage de services, afficher la topologie du maillage et analyser la santé de votre maillage.

Suivez les instructions suivantes pour déployer le tableau de bord Kiali, ainsi que Prometheus, Grafana et Jaeger.

Installe Kiali et les autres modules complémentaires et attends qu'ils soient déployés.

!! Depuis le dossier Istio

``` bash
kubectl apply -f samples/addons
kubectl rollout status deployment/kiali -n istio-system

deployment "kiali" successfully rolled out
```

On accède au Dashboard avec le code suivant :

``` bash
export PATH=$PWD/bin:$PATH
istioctl dashboard kiali
```

In the left navigation menu, select Graph and in the Namespace drop down, select default.

On lance des requête pour avoir des informations :

``` bash
for i in $(seq 1 100); do curl -s -o /dev/null "http://$GATEWAY_URL/productpage"; done
```

## Partie 2 - Request Routing

Instructions sur ce site : https://istio.io/latest/docs/tasks/traffic-management/request-routing/

A rentrer avant tout :

``` bash
 kubectl apply -f samples/bookinfo/networking/destination-rule-all.yaml
```

## 2.1 Route vers v1

Définir la route vers v1 :

``` bash 
kubectl apply -f samples/bookinfo/networking/virtual-service-all-v1.yaml
```

Montrer les routes avec :

``` bash
kubectl get virtualservices -o yaml
```

Sur la page web on ne voit plus les notes.

## 2.2 Route vers v2

Ici le but est que seul une personne voit les notes

``` bash
kubectl apply -f samples/bookinfo/networking/virtual-service-reviews-test-v2.yaml
```

``` bash
kubectl get virtualservice reviews -o yaml
```

Une fois ceci fait, si on se connecte sous le nom `Jason` on voit les notes sinon rien.

Cleanup :

``` bash
kubectl delete -f samples/bookinfo/networking/virtual-service-all-v1.yaml
```

## Partie 3 - Traffic Shifting

On route tout vers v1 :

``` bash
kubectl apply -f samples/bookinfo/networking/virtual-service-all-v1.yaml
```

Maintenant les étoiles ne sont plus visibles.

Transfer 50% of the traffic from reviews:v1 to reviews:v3 with the following command:

``` bash
kubectl apply -f samples/bookinfo/networking/virtual-service-reviews-50-v3.yaml
```

On confirme :

``` bash
kubectl get virtualservice reviews -o yaml
```

``` bash
  - route:
    - destination:
        host: reviews
        subset: v1
      weight: 50
    - destination:
        host: reviews
        subset: v3
      weight: 50
```

On voit bien 50/50s