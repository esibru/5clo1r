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

### Tâche 4

Création d'un [_NameSpace_](https://kubernetes.io/fr/docs/concepts/overview/working-with-objects/namespaces/) individuel sur l'environnement _kubernetes_ partagé à l'aide de la commande `kubectl create namespace`

|**Exigence**
|:--|
|Le _namespace_ doit être nommé `ns-<shortname>`.

:::warning Question
Quelle commande kubectl faut-il utiliser ?
Listez les différents _NameSpace_ à l'aide de la commande kubectl.
:::

### Tâche 5

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

_L'objectif est de créer un accès via un token a l'environnement kubernetes pour permettre son utilisation depuis un ordinateur distant._

### Tâche 6

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
