# Séance 8

## Définitions

**ConfigMaps**

Un [_ConfigMap_](https://kubernetes.io/docs/concepts/configuration/configmap/) est une ressource Kubernetes qui permet de stocker des données de configuration sous forme de paires clé-valeur et de les découpler du code des applications. Ce type de ressource est utilisé pour rendre les applications conteneurisées plus portables et plus faciles à configurer selon l'environnement, en fournissant aux conteneurs les paramètres nécessaires via des variables d'environnement ou en montant des fichiers de configuration. Cela permet de séparer le code des configurations, facilitant ainsi les mises à jour et l'adaptation à différents environnements (développement, production, etc.). 

Les cas d'utilisation principaux des _ConfigMap_ :
- stockage de configurations : les _ConfigMaps_ stockent des données de configuration non sensibles, comme des adresses de services externes, des ports ou des niveaux de journalisation;
- paires clé-valeur : elles permettent de stocker des données sous forme de paires clé-valeur, où la valeur peut être une chaîne simple ou un fichier de configuration complet;
- découplage du code : en séparant la configuration du code, les _ConfigMaps_ permettent de garder les images de conteneurs plus légères et réutilisables;
- portabilité : les applications sont plus faciles à déployer dans différents environnements en modifiant simplement la _ConfigMap_ correspondante sans avoir à reconstruire l'image du conteneur. 

Les _ConfigMap_ s'utilisent de différentes manières :  
- via des variables d'environnement : vous pouvez configurer les conteneurs d'un pod pour utiliser les valeurs d'une _ConfigMap_ comme variables d'environnement;
- via des fichiers montés : vous pouvez monter un volume basé sur une _ConfigMap_ dans le système de fichiers d'un conteneur. Les données de la _ConfigMap_ seront alors accessibles sous forme de fichiers;
- via des manifestes : les _ConfigMaps_ sont créées et gérées à l'aide de manifestes _YAML_, tout comme d'autres objets Kubernetes. 

**Secrets**

Un [_Secret_](https://kubernetes.io/docs/concepts/configuration/secret/) est une ressource Kubernetes utilisée pour stocker des informations sensibles comme des mots de passe, des clés d'authentification ou des chaînes de connexion à des bases de données. Ce type de ressource permet de séparer les données confidentielles des configurations de Pods, rendant l'application plus sécurisée et flexible en évitant d'avoir à stocker ces informations sensibles en clair dans les fichiers de configuration ou le code source. Les secrets sont stockés de manière encodée (souvent en base64) et sont mis à disposition des applications uniquement lorsqu'elles en ont besoin.

Les cas d'utilisation principaux des _Secret_:

- paires clé-valeur : chaque secret est une paire clé-valeur où la clé est un nom (par exemple, `username`) et la valeur est l'information sensible correspondante (par exemple, `secret password`);
- stockage sécurisé : les secrets sont stockés dans le cluster Kubernetes, mais de manière encodée pour éviter les fuites d'informations sensibles;
- utilisation par les applications : les secrets peuvent être montés dans des Pods comme des fichiers ou utilisés comme des variables d'environnement, permettant aux applications de les lire et de les utiliser pour s'authentifier auprès d'autres services;
- séparation des responsabilités : en externalisant les secrets, les développeurs peuvent se concentrer sur le code de l'application sans avoir à gérer directement les informations d'identification sensibles dans les fichiers de configuration. 

Les _Secret_ s'utilisent de différentes manières : 

- via des variables d'environnement : vous pouvez configurer les conteneurs d'un pod pour utiliser les valeurs d'un _Secret_ comme variables d'environnement;
- via des fichiers montés : vous pouvez monter un volume basé sur un _Secret_ dans le système de fichiers d'un conteneur. Les données du _Secret_ seront alors accessibles sous forme de fichiers;
- via des manifestes : les _Secret_ sont créés et gérés à l'aide de manifestes _YAML_, tout comme d'autres objets Kubernetes. 

## Tâche 1

De manière déclarative, créez un _Deployment_ exposant la variable d'environnement **BG_COLOR** via un _ConfigMap_.

### Exemple d'un _ConfigMap_ pour des variables d'environnements.
```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-config-map
data:
  VAR: value
```

### Exemple de _Pod_ exposant des variables d'environnement en provenances d'un _ConfigMap_
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
      envFrom:
        - configMapRef:
            name: my-config-map

```

:::warning Question
Quel est le contenu du fichier yaml pour créer le _Deployment_ aInsi que le _ConfigMap_ ?
:::

## Tâche 2

De manière déclarative, créez un _Deployment_ permettant d'exposer la variable d'environnement **BG_COLOR** via un _Secret_.

### Exemple d'un _Secret_ pour des variables d'environnements.
```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: my-secret
data:
  VAR: value
```

### Exemple de _Pod_ exposant des variables d'environnement en provenances d'un _Secret_
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
      envFrom:
        - secretRef:
            name: my-secret

```

:::warning Questions
Quel est le contenu du fichier yaml pour créer le _Deployment_ ainsi que le _Secret_ ?

Que pouvez-vous observer entre le fichier que vous avez écrit et le contenu de la meme ressource dans Kubernetes ?

Que pouvez-vous observer comme différence entre une gestion via un _ConfigMap_ et via un _Secret_.
:::

## Tâche 3

De manière déclarative, créez un _Deployment_ permettant d'externaliser le fichier de configuration `/app/config.yaml` dans un _ConfigMap_.

### Exemple du fichier `/app/config.yaml`
```yaml
---
# config.yaml
display:
  secrets: true         # true = afficher le bloc Secrets, 
                        # false = masquer
  configmap: true       # true = afficher le bloc ConfigMap, 
                        # false = masquer
```

### Exemple de _Pod_ utilisant un fichier de configuration en provenance d'un _ConfigMap_
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
        - name: config
          mountPath: /app/config.yaml
          subPath: config.yaml
  volumes:
    - name: config
      configMap:
        name: my-cm
```

:::warning Questions
Quel est le contenu du fichier yaml pour créer le _Deployment_ ainsi que le _ConfigMap_ ?

Comment pouvez-vous gérer de multiple fichiers dans un même _ConfigMap_ ?
:::

## Tâche 4

De manière déclarative, créez deux _Deployment_ permettant d'exposer la variable d'environnement **BG_COLOR** via un _Secret_ et d'externaliser le fichier de configuration `/app/config.yaml` via un _ConfigMap_.

|**Exigences**
|:--
| Le premier _Deployment_ doit avoir une couleur de fond **green** et le block **secrets** masqué.
| Le second _Deployment_ doit avoir ue couleur de fond **red** et le block **configmap** masqué.

L'accès à la page web de l'application Flask doit être géré via un _Ingress_ ayant un subpath spécifique à chaque déploiement.


:::warning Questions
Quel est le contenu des différents fichiers yaml ?

Expliquez la logique mise en place dans ses _Deployment_ (toute ressource confondue), quel est son intérêt ?
:::
