# Séance 2

**Installation de K3s**

:::info Objectifs
- Installation d'un environnement _kubernetes_ partagé.
- Lancement d'un premier _Pod_.
- Création du _NameSpace_ individuel et préparation de l'accès distant.
:::

## Laboratoire

### Tâche 1

[Installation de K3s](https://docs.k3s.io/quick-start) sur le serveur du groupe.

:::danger 
Une fois l'installation de K3S réalisée, la suite des tâches est individuelle.
:::


### Tâche 2

Lancer un premier Pod de manière impérative en utilisant l'image suivante : [docker.io/patteantoine/5clo1r:tagname](docker.io/patteantoine/5clo1r:tagname) avec la commande `kubectl run`.

:::warning Remarque
Un accès SSH est nécessaire pour réaliser cette tâche à distance, elle se fait via l'utilisateur _root_.
:::

|**Exigences**
|:--|
|Le _pod_ doit être nommé `<shortname>-imperatif`, où `<shortname>` est un placeholder pour votre identifiant utilisateur (_aka_ votre matricule composé de 5 chiffres).
|Le _pod_ doit avoir le label `app=pod-imperatif`.


:::warning Question
Quelle commande kubectl faut-il utiliser ?  
Listez les différents _Pod_ dans le _NameSpace_ `default` à l'aide de la commande kubectl.
:::

### Tâche 3

Lancer un second _pod_ de manière déclarative en utilisant l'image suivante [docker.io/patteantoine/5clo1r:tagname](docker.io/patteantoine/5clo1r:tagname) à l'aide de la commande `kubectl apply`.

:::warning Remarque
Un accès SSH est nécessaire pour réaliser cette tâche à distance, elle se fait via l'utilisateur _root_.
:::

#### Exemple de pod Kubernetes simple

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-simple-pod
  labels:
    my-label: value 
spec:
  containers:
    - name: my-container
      image: nginx
```

|**Exigences**
|:--|
|Le _pod_ doit être nommé `<shortname>-declaratif`, ou `<shortname>` est un placeholder pour votre identifiant utilisateur.
|Le _pod_ doit avoir le label `app: pod-declaratif`.


:::warning Questions
Quel est le contenu du fichier YAML pour le déploiement et quelle commande kubectl faut-il utiliser ?  

Listez les différents _Pod_ dans le _NameSpace_ `default` à l'aide de la commande kubectl adéquate.
:::