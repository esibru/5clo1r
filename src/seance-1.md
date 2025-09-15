# Séance 1

**Introduction à la conteneurisation et Kubernetes**

:::info Objectifs

- Comprendre les conteneurs. 
- Différencier VM et conteneur
- Découvrir l'orchestration
- Comprendre l'architecture K8s

:::

## Laboratoire

[Installation de Minikube.](https://minikube.sigs.k8s.io/docs/start/?arch=%2Flinux%2Fx86-64%2Fstable%2Fbinary+download)


<br/>
<br/>
<br/>
<br/>

### Tâche:

Exécutez un conteneur Docker en utilisant l'image suivante:  
docker.io/patteantoine/5clo1r:tagname

### Exigence:

Le conteneur doit être nommé "esicloud".  
L'application dans le conteneur écoute sur le port TCP/5000.

Vous devez exposer ce port interne sur le port TCP/8080 de votre machine locale.

### Question:

Quelle commande Docker faut-il utiliser ?
