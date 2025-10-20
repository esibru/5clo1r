# Séance 6

:::warning Remarque
L'image à utiliser est [docker.io/5clo1r/k8s-labo](docker.io/5clo1r/k8s-labo) avec le tag **0.1.0**

Les probes liveness et readiness doivent toujours être définie. Elles sont de type HTTP et sont disponible sur les path /liveness et /readiness
:::

**Variables d'environnement**

:::info Objectifs
- Donner des paramètres avant la création de mon _pod_ pour avoir des containers différents.
:::

Les variables d’environnement sont des paires clé-valeur accessibles par un _process_ pour configurer son comportement sans avoir à toucher au code source.

Exemple : définir le nom de la base de données, le port du serveur, ou le nom d’un utilisateur.

**Ingress**

:::info Objectifs
- Comprendre la différence avec un _Service_ de type _LoadBalancer_ ou _NodePort_.
- Apprendre à configurer des _Ingress  avec des règles _host_ et  path_ pour rediriger le trafic vers différents services.
:::

Un _Ingress_ sert à router le traffic externe (de type HTTP/HTTPS) vers les services internes du cluster. Il s'agit d'un point d'entrée unique qui permet de gérer différents services derrière une adresse IP unique ou encore derrière un même nom de domaine.

Un _Ingress_ utilise des règles de routage basées sur le nom de domaine ou le path pour rediriger les requêtes vers le service adéquat.

Un _Ingress_ peux gérer le TLS dans le cadre de mise en place de connexions HTTPS.

Les _Ingress_ ne sont pas fournis nativement par Kubernetes, il est nécessaire d'installer un _Ingress Controller_ tel que **Traefik** ou encore **Nginx**.

Un _Ingress Controller_ est déployé par défaut sur K3S, il s'agit de Traefik. Le _Service_ correspondant a une ip de type _LoadBalancer_. Pour vous permettre de l'utiliser, un enregistrement (_record_) DNS de type _wildcard_ a été créé pour chaque groupe avec la structure suivante : `*.grp-X-Y.5clo1r.in.esigoto.info`. 

Ils sont accessibles via le serveur dns interne à l'adresse 192.168.217.200.

## Tâche 1

L'application Flask utilise la variable d'environnement **BG_COLOR** afin de définir la couleur de fond de la page web. Cette variable est utilisée par la propriété CSS [background-color](https://www.w3schools.com/cssref/pr_background-color.php).

De manière déclarative, créez trois _Service_ et _Deployment_ correspondants qui auront chacun respectivement une couleur de fond rouge, vert et bleu.

Documentation Kubernetes : [Définir des variables d'environnement pour un Container](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/)

|**Exigences**
|:--
|Le _Service_ doit être de type _ClusterIP_
|Le _Service_ doit exposer le port interne de l'application (TCP/5000) sur le port identique
|Le _Label_ à utiliser sur le _Pod_ et le _selector_ du _Service_ doivent être *app.kubernetes.io/color* qui contiendra respectivement **red**, **green** et **blue**.
|La variable d'environnement **BG_COLOR** doit être utilisée pour obtenir un fond rouge, vert et bleu.

Vous pouvez valider la couleur de fond de la page web à l'aide d'un port-foward sur chaque service individuellement.

### Exemple d'un _Deployment_ avec définition d'une variable d'environnement *MYVAR*

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-deployment
  labels:
    app: my-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: container
          image: nginx:latest
          env:
            - name: MYVAR
              value: "HelloWorld"
```

:::warning Questions
Quel est le contenu du fichier yaml pour créer les trois _Service_ ainsi que les trois _Deployment_ ?
:::

## Tâche 2

De manière déclarative, créez un [_Ingress_](https://kubernetes.io/docs/concepts/services-networking/ingress/) pour chacun des _Service_ et _Deployment_ créés à la tâche précédente.

### Exemple d'un _Ingress_ simple

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    kubernetes.io/ingress.class: traefik
    traefik.ingress.kubernetes.io/frontend-entry-points: http
  name: my-ingress
spec:
  rules:
  - host: my-sub.domain.tld
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-svc
            port:
              number: 8080
```

|**Exigences**
|:--
|Le _Path_ doit être **/**
|L'_Ingress Class_ à utiliser est **traefik**
|L'annotation _traefik.ingress.kubernetes.io/frontend-entry-points_ doit avoir la valeur **http**
|Le pattern à suivre pour le domaine à utiliser avec chaque _Ingress_ est ```<shortname>-<color>.grp-<x>-<y>.5clo1r.in.esigoto.info```

:::warning Questions
Quel est le contenu du fichier YAML pour créer les différents _Ingress_
:::


## Tâche 3

De manière déclarative, créez un unique _Ingress_ permettant d'accéder aux trois _Service_ et _Deployment_ créés à la tâche 1 via trois règles spécifiques.

|**Exigences**
|:--
|Le **path** correspondant à chaque _Service_ doit être **/rouge**, **/vert** et **/bleu**.
|L'_Ingress Class_ à utiliser est **traefik**
|L'annotation _traefik.ingress.kubernetes.io/frontend-entry-points_ doit avoir la valeur **http**
|Le pattern à suivre pour le domaine à utiliser avec chaque _Ingress_ est `<shortname>-all.grp-<x>-<y>.5clo1r.in.esigoto.info`

:::warning Questions
Quel est le contenu du fichier YAML pour créer cet unique _Ingress_ donnant accès aux différents _Service_ et _Deployment_

Expliquez le rôle du paramètre _pathType_ et les différentes valeur possible.
:::