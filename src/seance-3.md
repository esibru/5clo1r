# Séance 3 

**Accès distant**

- Mettre en place l’accès distant à k8s via un token.
- Configurer l’espace personnel.

**Pods & deployments**

- Maîtriser les objets _pod_
- Gérer les déploiements (_replica set_, _stateful set_ et _daemon set_)
- Scalabilité

_Port forwarding_ pour voir le pod. 

### Tâche 1

Création d'un [_NameSpace_](https://kubernetes.io/fr/docs/concepts/overview/working-with-objects/namespaces/) individuel sur l'environnement _kubernetes_ partagé à l'aide de la commande `kubectl create namespace`

|**Exigence**
|:--|
|Le _namespace_ doit être nommé `ns-<shortname>`.

:::warning Question
Quelle commande kubectl faut-il utiliser ?
Listez les différents _NameSpace_ à l'aide de la commande kubectl.
:::                                 

### Tâche 2

Creation d'un [_ServiceAccount_](https://kubernetes.io/docs/concepts/security/service-accounts/) individuel dans le _namespace_ individuel sur l'environnement _kubernetes_ partagé à l'aide de la commande `kubectl create serviceaccount`.

|**Exigence**
|:--|
|Le _ServiceAccount_ doit être nommé `sa-<shortname>`.

:::warning Question
Quelle commande kubectl faut-il utiliser ?
Listez les différents _ServiceAccount_ dans le _NameSpace_ invidivuel ainsi que sur l'ensemble de l'environnment _kubernetes_ à l'aide de la commande kubectl.
:::

Création d'un [_ClusterRoleBinding_](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding) pour assigner le _ClusterRole_ `cluster-admin` pré-existant au _ServiceAccount_ précédemment créé à l'aide de la commande `kubectl create clusterrolebinding`, il se trouve dans le _NameSpace_ `default`.

|**Exigences**
|:--|
|Le _ClusterRoleBinding_ doit être nommé `cluster-admin-<shortname>`.
|Le _ClusterRole_ à utiliser est `cluster-admin`

:::warning Question
Quelle commande kubectl faut-il utiliser ?
:::

Création d'un [_secret_](https://kubernetes.io/docs/concepts/configuration/secret/) - de manière déclarative - lié au _ServiceAccount_ précédemment créé pour obtenir un _token_ d'accès distant.

|**Exigences**
|:--|
|Le _Secret_ doit être nommé `<shortname>-token`.
|Le _Secret_ doit être de type `kubernetes.io/service-account-token`

#### Exemple de secret Kubernetes

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: sa-token
  annotations:
    kubernetes.io/service-account.name: sa
type: kubernetes.io/service-account-token
```

:::warning Question
Quel est le contenu du fichier yaml correspondant au secret et quelle commande kubectl faut-il utiliser pour l'appliquer ?
:::

_L'objectif est de créer un accès via un token à l'environnement kubernetes pour permettre son utilisation depuis un ordinateur distant._

### Tâche 3

Installation de [`kubectl`](https://kubernetes.io/docs/tasks/tools/) sur un ordinateur distant afin d’interagir avec l'environnement _kubernetes_ partagé via le _ServiceAccount_ crée précédemment.

Pour créer le fichier de configuration nécessaire a `kubectl` sur l'ordinateur distant il est nécessaire de récupérer le fichier kubeconfig du serveur à l'aide de la commande `kubectl config view --raw` et d'y réaliser des modifications tel que le nom ou ip du serveur, le nom d'utilisateur a utiliser ainsi que le token.

Le token peux être récupérer en affichant le contenu du _secret_ crée lors de la tache précédente à l'aide de la commande `kubectl get secret <shortname>-secret -o yaml`. Attention, dans un _secret_ les données sont encodées en base64.
                                                                                                                                                                                                                 #### Exemple de fichier kubeconfig utilisant un token

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: {omitted}
    server: https://127.0.0.1:6443
  name: default
contexts:
- context:
    cluster: default
    user: my-user
  name: default
current-context: default
kind: Config
preferences: {}
users:
- name: my-user
  user:
    token: {omitted}
```

La clé `clusters[0].cluster.certificate-authority-data` doit contenir le CertificateAuthority de l’environnent _kubernetes_ au format base64.

la clé `users[0].user.token` doit contenir le token de l'utilisateur non encodé au format base64.

Il est nécessaire de définir la variable d'environnement `KUBECONFIG` avec le _path_ vers votre fichier de configuration.

|Shell|Commande|
|:--|:--|
|PowerShell|$env:KUBECONFIG = "C:\Users\myuser\kubeconfig-sa-myuser-token.yaml"|
|Bash|export KUBECONFIG=/home/myuser/kubeconfig-sa-myuser-token.yaml|

:::warning Question
Listez les différents _NameSpace_ et _pod_ à l'aide de la commande `kubectl`.
:::

_L'objectif est d'accéder a l'environnement kubernetes depuis un ordinateur disant._

### Tâche 4

:::warning Remarque
Il est nécessaire de maîtriser les notions déclaratif et impératif. Les tâches suivantes se réaliseront toujours de manière déclarative.
:::

Déployez un Pod de manière déclarative via votre accès distant (tâche 3 de la séance 2) et accédez à son contenu en utilisant la commande kubectl port-forward.

|**Exigences**|
|:--|
|L'application dans le conteneur écoute sur le port TCP/5000.
|Exposer ce port interne sur le port TCP/8080 de la machine locale.
|Le conteneur doit être visible dans son navigateur

:::warning Question
Quelle commande kubectl faut-il utiliser pour acceder à l'application Web dans le pod depuis votre console ?
:::

### Tâche 5

Un [_deployment_](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) est un objet Kubernetes qui gère la création et les mises à jour des Pods. Il garantit l'exécution du nombre souhaité de réplicas et gère automatiquement les mises à jour et les rollbacks.

Un _deployment_ crée un [_replicaset_](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/) qui crée a son tour les _pods_.

Créez un manifeste YAML déclaratif pour déployer un _deployment_ avec l'image container utilisé précédement et accédez à son contenu en utilisant la commande [`kubectl port-forward`](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/).

####  Exemple d'un déploiment simple

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:latest
```
|**Exigences**
|:--|
|Le _deployment_ doit être nommé `<shortname>-deploy`, ou `<shortname>` est un placeholder pour votre identifiant utilisateur.
|Le _pod_ doit avoir le label `app: demo` et ce label doit etre utilisé dans le selector.
|le _deployment_ doit avoir 1 replicas.

:::warning Question
Que peux-t-on observer comme différence entre un _pod_ crée individuellement - comme à la tâche précédente -  d'un _pod_ crée via un _deployment_ ? Quel est le lien avec le _replicaset_ ?
:::

:::warning Question
Quelle commande kubectl faut-il utiliser pour acceder à l'application Web dans le pod - via le deployment - depuis votre console ?
:::

### Tâche 6

Faites varier les paramètres du déploiement de la manière suivante et réalisez quelques observations sur le comportement des _pods_ ainsi que le _replicaset_.

Les [probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) définies sur un  _pod_ permet à _kubernetes_ d'en connaitre le status.  

|**Exigences**
|:--|
|Le deployment doit maintenant avoir 3 replicas
|Ajoutez le label _environment_ ayant la valeur _labo_ a votre _pod template_
|Ajoutez les probes liveness et readiness sur /liveness et /readiness

:::warning Question
Que peut-on observer sur les _replicaset_ et les _pods_ après l'application du changement de paramètre du déploiement ?
:::

