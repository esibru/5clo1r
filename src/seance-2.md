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

### Tâche 2

Lancer un premier Pod de manière impérative en utilisant l'image suivante : [docker.io/patteantoine/5clo1r:tagname](docker.io/patteantoine/5clo1r:tagname) avec la commande `kubectl run`.

|**Exigence**
|:--|
|Le _pod_ doit être nommé `<shortname>-imperatif`, où `<shortname>` est un placeholder pour votre identifiant utilisateur.
|Le _pod_ doit avoir le label `app: pod-imperatif`.


:::warning Question
Quelle commande kubectl faut-il utiliser ?
Listez les différents _Pod_ dans le _NameSpace_ `default` à l'aide de la commande kubectl.
:::

### Tâche 3

Lancer un second _pod_ de maniere declarative en utilisant l'image suivante [docker.io/patteantoine/5clo1r:tagname](docker.io/patteantoine/5clo1r:tagname) a l'aide de la commande `kubectl apply`.

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

|**Exigence**
|:--|
|Le _pod_ doit etre nommé `<shortname>-declaratif`, ou `<shortname>` est un placeholder pour votre identifiant utilisateur.
|Le _pod_ doit avoir le label `app: pod-declaratif`.


:::warning Question
Quel est le contenu du fichier YAML pour le déploiement et quelle commande kubectl faut-il utiliser ?
Listez les différents _Pod_ dans le _NameSpace_ `default` à l'aide de la commande kubectl.
:::

### Tâche 4

Creation d'un [_ServiceAccount_](https://kubernetes.io/docs/concepts/security/service-accounts/) individuel dans le _namespace_ `default` sur l'environnement _kubernetes_ partagé à l'aide de la commande `kubectl create serviceaccount`.

:::warning Question
Quelle commande kubectl faut-il utiliser ?
Listez les différents _ServiceAccount_ dans le _NameSpace_ `default` à l'aide de la commande kubectl.
:::

Creation d'un [_ClusterRoleBinding_](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding) pour assigner le _ClusterRole_ `cluster-admin` pré-existant au _ServiceAccount_ précédemment créé a l'aide de la commande `kubectl create clusterrolebinding`, il se trouve dans le _NameSpace_ default

|**Exigence**
|:--|
|Le _ClusterRoleBinding_ doit etre nommé `cluster-admin-<shortname>`.
|Le _ClusterRole_ à utiliser est `cluster-admin`

:::warning Question
Quelle commande kubectl faut-il utiliser ?
:::

Création d'un [_secret_](https://kubernetes.io/docs/concepts/configuration/secret/) lié au _ServiceAccount_ précedemment crée pour obtenir un _token_ d'accès distant.

|**Exigence**
|:--|
|Le _Secret_ doit etre nommé `<shortname>-token`.
|Le _Secret_ doit etre de type `kubernetes.io/service-account-token`

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
Quel est le contenu du fichier yaml correspondant au secret et quelle commande kubectl faut-il utiliser ?
:::

_L'objectif est de creer un acces via un token a l'environnement kubernetes pour permettre son utilisation depuis un ordianteur disant._

### Tâche 5

Installation de [`kubectl`](https://kubernetes.io/docs/tasks/tools/) sur un ordinateur distant afin d'interragir avec l'environnement _kubernetes_ partagé via le _ServiceAccount_ crée precedement.

Pour créer le fichier de configuration necessaire a `kubectl` sur l'ordinateur distant il est necessaire de recuperer le fichier kubeconfig du serveur a l'aide de la commande `kubectl config view --raw` et d'y realiser des modifications tel que le nom ou ip du serveur, le nom d'utilisateur a utiliser ainsi que le token.

Le token peux etre recuperer en affichant le contenu du _secret_ crée lors de la tache precedente a l'aide de la commande `kubectl get secret <shortname>-secret -o yaml`. Attention, dans un _secret_ les données sont encodée en base64.

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

La clé `clusters[0].cluster.certificate-authority-data` doit contenir le CertificateAuthority de l'environnment _kubernetes_ au format base64.

la clé `users[0].user.token` doit contenir le token de l'utilisateur non encodé au format base64.

 Il est nécessaire de definir la variable d'environnement `KUBECONFIG` avec le _path_ vers votre fichier de configuration.

|Shell|Commande|
|:--|:--|
|PowerShell|$env:KUBECONFIG = "C:\Users\myuser\kubeconfig-sa-myuser-token.yaml"|
|Bash|export KUBECONFIG=/home/myuser/kubeconfig-sa-myuser-token.yaml|

_L'objectif est d'acceder a l'environnement kubernetes depuis un ordianteur disant._

### Tâche 6

Création d'un [_NameSpace_](https://kubernetes.io/fr/docs/concepts/overview/working-with-objects/namespaces/) individuel sur l'environnement _kubernetes_ partagé a l'aide de la commande `kubectl create namespace`

|**Exigence**
|:--|
|Le _namespace_ doit etre nommé `ns-<shortname>`.

:::warning Question
Quelle commande kubectl faut-il utiliser ?
Listez les différents _NameSpace_ à l'aide de la commande kubectl.
:::