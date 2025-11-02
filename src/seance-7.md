# Séance 7

:::warning Remarque
L'image à utiliser est [docker.io/5clo1r/k8s-labo](docker.io/5clo1r/k8s-labo) avec le tag **0.1.0**

Les probes liveness et readiness doivent toujours être définie. Elles sont de type HTTP et sont disponible sur les path /liveness et /readiness
:::

**Stockage**

Les _Volumes_ permettent de stocker des données de manières persistante, partagée entre différent _Pod_. Ils répondent à la limite liée au cycle de vie d'un _Pod_ : le système de fichier d'un _Pod_ est éphémère.

On peux utiliser les volumes pour préserver les données quand un _Pod_ redémarre, accéder à un système de stockage externe ou injecter des éléments de configuration via des ConfigMaps ou Secrets.

Différent types de volumes existent.
- _emptyDir_ : un volume vide est crée à la création du _Pod_ et disparait à la suppression du _Pod_.
- _ConfigMaps_ et _Secret_ : inject des éléments de configuration dans un _Pod_.
- _PersistentVolume_ et _PersistentVolumeClaims_ : permet un stockage persistant indépendant du cycle de vie du _Pod_. On peux avoir un provisionning dynamique à l'aide de _StorageClass_.

**Accéder au filesystem d'un _Pod_**

Pour accèder au filesystem d'un _Pod_, il est possible d'executer des commandes dans le _Pod_ à l'aide de la commande kubectl ``kubectl exec -it <pod-name> -- /bin/sh``

## Tâche 1

De manière déclarative, créez un _Deployment_ avec un volume éphémère de type _emptyDir_.

|**Exigences**
|:--
|Le _Deployment_ doit avoir un replica
|Le _Volume_ doit être appelé *tmp-data*
|Le _Volume_ doit etre accessible via le path /srv

### Exemple de _Pod_ avec un volume de type _emptyDir_

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
    - name: my-container
      image: nginx
      volumeMounts:
        - name: shared
          mountPath: /usr/share/nginx/html
  volumes:
    - name: shared
      emptyDir: {}
```

:::warning Questions
Quel est le contenu du fichier yaml pour créer le déployment avec un volume de type _emptyDir_

Dans le _Pod_ créé un fichier /srv/fichier, redemarré le _Pod_ est observé le contenu du répertoire /srv
:::

## Tâche 2

De manière déclarative, créez un _Deployment_ avec un volume persistant.

|**Exigences**
|:--
|Le _Deployment_ doit avoir un replica
|Le _Volume_ doit être appelé *tmp-data*
|Le _Volume_ doit etre accessible via le path /srv
|Le _Volume_ doit avoir une taille de 500Mo

### Exemple d'un _PersistentVolumeClaims_ utilisant une _StorageClass_ nommée **local-path**

```yaml
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: local-path
  resources:
    requests:
      storage: 1Gi
```

### Exemple de _Pod_ utilisant un volume crée via un _PersistentVolumeClaims_

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pvc
spec:
  containers:
    - name: app
      image: nginx
      volumeMounts:
        - name: data
          mountPath: /data
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: my-pvc
```

:::warning Questions
Quel est le contenu du fichier yaml pour créer le déployment avec un volume via un _PersistentVolumeClaim_.

Dans le _Pod_ créé un fichier /srv/fichier, redemarré le _Pod_ est observé le contenu du répertoire /srv
:::

## Tâche 3

De manière déclarative, créez un _StateFulSet_ avec un volumes via un _VolumeClaimTemplates_.

|**Exigences**
|:--
|Le _StateFulSet_ doit avoir 3 replica
|Le _Volume_ doit être appelé *tmp-data*
|Le _Volume_ doit etre accessible via le path /srv
|Le _Volume_ doit avoir une taille de 500Mo
|La _StorageClass_ à utiliser est *local-path*

### Exemple partiel d'un _StateFulSet_ avec un _volumeClaimTemplates_

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: "my-storage-class"
      resources:
        requests:
          storage: 1Gi
```

:::warning Questions
Quel est le contenu du fichier yaml pour créer le _StateFulSet_.

Comment sont nommé les différent _PersistentVolumeClaims_, quel est la realation le nom des _Pod_.
:::
