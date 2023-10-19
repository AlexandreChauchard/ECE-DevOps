# Lab 5 

## Partie 1 - Utiliser Vagrant avec Shell Provisioner

### 1.1 Préparer un environnement virtuel 

Après avoir télécharger Vagrant nous devons préparer une `Vagrantfile`, cependant nous en avons déjà une fournie dans le lab : `lab/part-1`.

### 1.2 Créer une machine virtuelle 

On utilise la commande suivante pour créer la machine selon notre `Vagrantfile` :

``` bash
vagrant up
```  

On peut aussi tester les commandes suivantes pour différents objectifs : 

```bash
# will check VMs status
vagrant status 

# stop the VMs
vagrant halt

# will destroy VMs
vagrant destroy
```

### 1.3 Vérifier que tout fonctionne en connectant la VM via SSH

On utilise la commande suivante : 

``` bash
vagrant ssh
```

Cela ouvre une session dans laquelle on peut utiliser toutes les commandes que l'on veut en bash. On peut ensuite ouvrir notre VM pour voir que tout fonctionne.

### 1.4 Jouer avec les différentes commandes pour Shell Provisioner

Ici on suivra les instructions fournies dans l'énnoncé.