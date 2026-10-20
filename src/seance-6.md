# Séance 6

**Réseau avancé : Gateway API**

> _Une IP par service, c'est bien. Un nom par service derrière une seule IP, c'est mieux._

Lors de la séance précédente, chaque _Service_ de type _LoadBalancer_ a reçu sa propre IP grâce à MetalLB. Cela fonctionne, mais cela ne passe pas à l'échelle : chaque nouvelle application consomme une IP de votre _range_, et rien ne permet de distinguer deux applications web autrement que par leur IP ou leur port.

Or, pour du trafic HTTP, la requête contient bien plus d'informations qu'une IP et un port : un nom d'hôte (_hostname_), un chemin (_path_), des en-têtes… Un composant capable de lire ces informations peut donc recevoir tout le trafic sur une seule IP et le **router** vers le bon _Service_.

C'est là qu'entre en jeu **Gateway API**.

:::info Objectifs

- Donner des paramètres à un _Pod_ via des variables d'environnement
- Comprendre la différence entre un _Service_ de type _LoadBalancer_ et une _Gateway_
- Comprendre le modèle de Gateway API : _GatewayClass_, _Gateway_ et _HTTPRoute_
- _Les pods sont accessibles de l'extérieur via un nom de domaine, derrière une IP unique_
:::

:::warning Remarque
L'image à utiliser est [docker.io/5clo1r/k8s-labo](docker.io/5clo1r/k8s-labo) (cf. [Informations techniques](./techniques.md)).

Les probes _liveness_ et _readiness_ doivent toujours être définies.
:::

## Tâche 1

Vous voulez déployer trois fois la même application, mais avec un comportement différent pour chacune. Plutôt que de construire trois images, vous allez la **paramétrer**.

Les variables d'environnement sont des paires clé-valeur accessibles par un _process_ pour configurer son comportement sans avoir à toucher au code source. Par exemple : définir le nom de la base de données, le port du serveur, ou le nom d'un utilisateur.

L'application Flask utilise la variable d'environnement **BG_COLOR** afin de définir la couleur de fond de la page web. Cette variable est utilisée par la propriété CSS [background-color](https://www.w3schools.com/cssref/pr_background-color.php).

De manière déclarative, créez trois _Service_ et les trois _Deployment_ correspondants qui auront respectivement une couleur de fond rouge, verte et bleue.

Documentation Kubernetes : [Définir des variables d'environnement pour un Container](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/)

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

|**Exigences**
|:--
|Le _Service_ doit être de type _ClusterIP_
|Le _Service_ doit exposer le port interne de l'application (TCP/5000) sur le port identique
|Le _Label_ à utiliser sur le _Pod_ et le _selector_ du _Service_ doit être *app.kubernetes.io/color* qui contiendra respectivement **red**, **green** et **blue**
|La variable d'environnement **BG_COLOR** doit être utilisée pour obtenir un fond rouge, vert et bleu

Vous pouvez valider la couleur de fond de la page web à l'aide d'un _port-forward_ sur chaque _Service_ individuellement.

:::warning Questions
Quel est le contenu du fichier YAML pour créer les trois _Service_ ainsi que les trois _Deployment_ ?
:::

## Tâche 2

— Trois couleurs, trois IP… ça coûte cher en adresses IP.  
— Il faudrait un facteur qui distribue le courrier aux bonnes adresses.

Nous voulons exposer tous nos services web derrière **une seule IP** : la requête vers `red.<matricule>.5clo1r.in.esigoto.info` doit arriver sur le _Service_ rouge, celle vers `blue.<matricule>.5clo1r.in.esigoto.info` sur le _Service_ bleu, et ainsi de suite.

Pour ce faire, nous avons besoin d'un _reverse proxy_ piloté par Kubernetes. C'est le rôle de [**Gateway API**](https://gateway-api.sigs.k8s.io/).

:::info
Comme pour le type `LoadBalancer`, Kubernetes **définit** Gateway API sans l'**implémenter**. Les ressources (_GatewayClass_, _Gateway_, _HTTPRoute_…) ne sont même pas présentes par défaut dans le cluster : ce sont des _CRD_ qu'il faut installer. Il faut ensuite un contrôleur qui lit ces ressources et configure un _proxy_ en conséquence. Dans ce cours, nous utilisons [**Envoy Gateway**](https://gateway.envoyproxy.io/).
:::

:::warning
Dans le cas particulier de `k3s`, un contrôleur _Ingress_ — Traefik — est installé par défaut… mais rappelez-vous. _Vous_ avez choisi de le désactiver. Traefik y est configuré pour l'API _Ingress_ : nous l'avons écarté afin d'utiliser la dernière évolution de Kubernetes en matière de gestion du trafic entrant, **Gateway API**.
:::

:::tip DÉFINITION
Une **CRD** (_Custom Resource Definition_) permet d'ajouter de nouveaux types de ressources (de nouveaux `kind`) à l'API Kubernetes. Une fois la CRD installée, on manipule ces ressources avec `kubectl` comme n'importe quel _Pod_ ou _Service_. Un **contrôleur** surveille ces ressources et agit pour que l'état réel corresponde à l'état souhaité.
:::

:::tip Et l'API _Ingress_ ?
Gateway API est le successeur de l'API _Ingress_. L'API _Ingress_ est figée : elle n'évolue plus, et toute fonctionnalité avancée (réécriture d'URL, redirection, pondération du trafic…) y dépend d'annotations propres à chaque contrôleur. Gateway API intègre ces fonctionnalités de manière standard et portable.
:::

Gateway API sépare les responsabilités en plusieurs ressources :

| Ressource | Portée | Rôle | Responsable typique
|:--|:--|:--|:--
| _GatewayClass_ | cluster | Définit l'implémentation (le contrôleur) utilisée | _Ian_, fournisseur d'infrastructure
| _Gateway_ | namespace | Point d'entrée : adresse IP, ports, protocoles (_listeners_) | _Chihiro_, opérateur du cluster
| _HTTPRoute_ | namespace | Règles de routage (_hostname_, _path_, en-têtes…) vers des _Service_ | _Ana_, développeuse de l'application

Installation du composant **Envoy Gateway**.

L'installation est réalisée à l'aide de **Helm** dans le namespace _k8s-infra-envoy-gateway_. Le _chart_ est publié dans un registre OCI (`oci://docker.io/envoyproxy/gateway-helm`). Il est également nécessaire d'installer les CRD de Gateway API. Il n'y a bien sûr qu'une seule instance d'**Envoy Gateway** dans un cluster k8s.

Une fois Envoy Gateway installé, il faut déclarer la _GatewayClass_ qui lui est associée. La _GatewayClass_ est aussi une ressource à l'échelle du cluster : il n'en faut donc qu'**une seule par cluster**, partagée par toutes les _Gateway_.

:::warning
Mettez-vous d'accord avec les autres membres du groupe : une seule personne installe Envoy Gateway et crée la _GatewayClass_.
:::

### Exemple d'une _GatewayClass_

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: envoy
spec:
  controllerName: gateway.envoyproxy.io/gatewayclass-controller
```

|**Exigences**
|:--
|Envoy Gateway est installé via Helm, avec une _release_ nommée **envoy**, dans le namespace _k8s-infra-envoy-gateway_
|Une seule _GatewayClass_, nommée **envoy**, est présente dans le cluster
|Le _controllerName_ de la _GatewayClass_ est celui d'Envoy Gateway

:::warning Questions
Comment le namespace adéquat est-il créé ?  
Comment Envoy Gateway est-il installé ?

Quelles sont les CRD installées par le _chart_ ? Comment les lister ?
:::

## Tâche 3

La _GatewayClass_ dit _qui_ gère le trafic. Il faut maintenant un point d'entrée : une [**_Gateway_**](https://gateway-api.sigs.k8s.io/docs/concepts/api-overview/#gateway).

Pour chaque _Gateway_ créée, Envoy Gateway déploie un _proxy_ Envoy ainsi qu'un _Service_ de type _LoadBalancer_… dont l'IP est fournie par MetalLB (cf. [séance 5](./seance-5.md)). Les composants s'empilent.

Chaque personne crée sa propre _Gateway_ dans son namespace : l'utilisatrice _alice_ reçoit le trafic de ses applications sur une IP de son _range_, tandis que l'utilisateur _bob_ reçoit le sien sur une IP du sien.

:::info
Un enregistrement (_record_) DNS de type _wildcard_ a été créé pour chaque personne avec la structure suivante : `*.<matricule>.5clo1r.in.esigoto.info` (par ex. `*.12345.5clo1r.in.esigoto.info`). Il est accessible via le serveur DNS interne à l'adresse 192.168.217.255 et résout vers la **dernière IP de votre _range_**.

C'est cette IP que votre _Gateway_ doit utiliser.

```bash
dig +short test.<matricule>.5clo1r.in.esigoto.info @192.168.217.255
```
:::

:::warning
La dernière IP de votre _range_ est réservée à votre _Gateway_. Si un _Service_ de la séance précédente l'utilise déjà, MetalLB ne pourra pas l'attribuer à la _Gateway_.
:::

### Exemple d'une _Gateway_ simple

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: my-gateway
  namespace: ns-apt
spec:
  gatewayClassName: envoy
  infrastructure:
    annotations:
      metallb.io/loadBalancerIPs: 192.0.2.10
  listeners:
    - name: http
      protocol: HTTP
      port: 80
      allowedRoutes:
        namespaces:
          from: Same
```

|**Exigences**
|:--
|La _Gateway_ doit utiliser la _GatewayClass_ **envoy**
|La _Gateway_ doit avoir un _listener_ HTTP sur le port 80
|L'IP _LoadBalancer_ de la _Gateway_ doit être la dernière IP de votre _range_ (celle vers laquelle résout votre _wildcard_)
|Seules les _HTTPRoute_ de votre namespace peuvent s'attacher à la _Gateway_

:::warning Questions
Quel est le contenu du fichier YAML pour créer la _Gateway_ ?

Quelle est l'IP assignée à votre _Gateway_ ? Comment la trouve-t-on ?

Quelles ressources (_Deployment_, _Service_…) Envoy Gateway a-t-il créées suite à la création de votre _Gateway_ ? Dans quel namespace ? De quel type est le _Service_ ?

Quel est le rôle du champ `infrastructure.annotations` ? Quelle annotation MetalLB permet de choisir une IP précise plutôt qu'une IP quelconque du _pool_ ?
:::

## Tâche 4

La _Gateway_ reçoit le trafic, mais ne sait pas encore où l'envoyer. Les règles de routage sont décrites dans des [**_HTTPRoute_**](https://gateway-api.sigs.k8s.io/api-types/httproute/).

Une _HTTPRoute_ s'attache à une _Gateway_ via le champ `parentRefs`. Elle associe un ou plusieurs _hostnames_ et des règles (_path_, en-têtes…) à des _Service_ (`backendRefs`).

:::tip
Le _Service_ fournit un point d'accès stable vers les _Pods_. L'_HTTPRoute_ fournit un point d'accès **nommé** vers les _Services_. La _Gateway_, elle, ne connaît ni les uns ni les autres : elle se contente d'accepter les routes qui s'y attachent.
:::

De manière déclarative, créez une _HTTPRoute_ pour chacun des _Service_ créés à la tâche 1.

### Exemple d'une _HTTPRoute_ simple

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: my-route
  namespace: ns-apt
spec:
  parentRefs:
    - name: my-gateway
  hostnames:
    - my-sub.domain.tld
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /
      backendRefs:
        - name: my-svc
          port: 8080
```

|**Exigences**
|:--
|Le _path_ doit être **/**
|Les _HTTPRoute_ doivent être attachées à la _Gateway_ de la tâche précédente
|Le _hostname_ de chaque _HTTPRoute_ doit suivre le _pattern_ `<color>.<matricule>.5clo1r.in.esigoto.info`

:::warning Questions
Quel est le contenu du fichier YAML pour créer les différentes _HTTPRoute_ ?

Comment vérifier qu'une _HTTPRoute_ a bien été acceptée par la _Gateway_ ? (indice : regardez le `status` de la ressource)

Quelle commande `curl` permet de tester chacune des routes ? Que se passe-t-il si vous accédez directement à l'IP de la _Gateway_ sans _hostname_ ?
:::

## Tâche 5

Un nom par couleur, c'est bien mais un seul nom pour l'application avec un chemin par couleur, c'est mieux. 

De manière déclarative, créez une **unique** _HTTPRoute_ permettant d'accéder aux trois _Service_ créés à la tâche 1 via trois règles spécifiques.

L'application Flask écoute sur le _path_ `/` : une requête vers `/red` doit donc être réécrite en `/` avant d'atteindre le _Service_.

:::info
Avec l'API _Ingress_, cette réécriture nécessitait une ressource ou une annotation propre au contrôleur (par ex. un _Middleware_ Traefik). Avec Gateway API, elle est standard : elle se fait à l'aide d'un filtre [_URLRewrite_](https://gateway-api.sigs.k8s.io/guides/http-redirect-rewrite/) directement dans la règle de l'_HTTPRoute_.
:::

### Exemple d'une règle avec réécriture du préfixe

```yaml
# …
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /red
      filters:
        - type: URLRewrite
          urlRewrite:
            path:
              type: ReplacePrefixMatch
              replacePrefixMatch: /
      backendRefs:
        - name: my-svc-red
          port: 5000
# …
```

|**Exigences**
|:--
|Le _path_ correspondant à chaque _Service_ doit être **/red**, **/green** et **/blue**
|L'_HTTPRoute_ doit être attachée à la _Gateway_ de la tâche 3
|Le _hostname_ doit être `all.<matricule>.5clo1r.in.esigoto.info`

:::warning Questions
Quel est le contenu du fichier YAML pour créer cette unique _HTTPRoute_ donnant accès aux différents _Service_ ?

Expliquez le rôle du champ `path.type` et les différentes valeurs possibles.

Que se passe-t-il pour une requête vers `/` ou vers `/yellow` sur ce _hostname_ ?

Quelles sont les différences entre l'API _Ingress_ et Gateway API ? Citez-en au moins trois.
:::
