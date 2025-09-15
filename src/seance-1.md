# Séance 1

**Introduction à la conteneurisation et Kubernetes**

:::info Objectifs

- Comprendre les conteneurs. 
- Différencier VM et conteneur
- Découvrir l'orchestration
- Comprendre l'architecture K8s

:::

## Laboratoire

### Tâche 1

Exécutez un conteneur Docker en utilisant l'image suivante:  
[docker.io/patteantoine/5clo1r:tagname](docker.io/patteantoine/5clo1r:tagname)

|**Exigences**|
|:--|
|Le conteneur doit être nommé _esicloud_.  
|L'application dans le conteneur écoute sur le port TCP/5000.
|Exposer ce port interne sur le port TCP/8080 de la machine locale.
|Le conteneur doit être visible dans son navigateur

:::warning Question
Quelle commande Docker faut-il utiliser ?
:::

### Tâche 2

[Installation de Minikube.](https://minikube.sigs.k8s.io/docs/start/?arch=%2Flinux%2Fx86-64%2Fstable%2Fbinary+download)

_L'objectif est de fournir un environnement Kubernetes fonctionnel pour le travail à la maison._

### Tâche 3

_Préparation à la séance 2_

Installation de Linux/Debian sur un serveur du local.

|**Exigences**|
|:-- |
|Identifiant _user_ : `user` / `user`
|Identifiant _root_ : `root` / <donné oralement>
|Pas d'environnement graphique (évidemment)
|Adresse IP : cfr. document interne
|Nom de domaine : au choix


