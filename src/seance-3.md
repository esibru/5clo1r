# Séance 3 

**Accès distant**

:::info Objectifs

- Mettre en place l’accès distant à k8s via un token.
- Configurer l’espace personnel.

:::


## Laboratoire

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

Création d'un [_ServiceAccount_](https://kubernetes.io/docs/concepts/security/service-accounts/) individuel dans le _namespace_ individuel sur l'environnement _kubernetes_ partagé à l'aide de la commande `kubectl create serviceaccount`.

|**Exigence**
|:--|
|Le _ServiceAccount_ doit être nommé `sa-<shortname>`.

:::warning Question
Quelle commande kubectl faut-il utiliser ?  
Listez les différents _ServiceAccount_ dans le _NameSpace_ individuel ainsi que sur l'ensemble de l'environnement _kubernetes_ à l'aide de la commande kubectl.
:::

Création d'un [_ClusterRoleBinding_](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding) pour assigner le _ClusterRole_ `cluster-admin` pré-existant au _ServiceAccount_ précédemment créé à l'aide de la commande `kubectl create clusterrolebinding`.

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

_L'objectif est de créer un accès à l'environnement kubernetes via un token pour permettre son utilisation depuis un ordinateur distant._

### Tâche 3

Installation de [`kubectl`](https://kubernetes.io/docs/tasks/tools/) sur un ordinateur distant afin d’interagir avec l'environnement _kubernetes_ partagé via le _ServiceAccount_ crée précédemment.

Pour créer le fichier de configuration nécessaire à `kubectl` sur l'ordinateur distant il est nécessaire de récupérer le fichier kubeconfig du serveur à l'aide de la commande `kubectl config view --raw` et d'y réaliser des modifications telles que ; le nom ou l'IP du serveur, le nom d'utilisateur à utiliser ainsi que le token.

Le token peut être récupéré en affichant le contenu du _secret_ créé lors de la tâche précédente à l'aide de la commande `kubectl get secret <shortname>-secret -o yaml`. 

:::danger
Attention, dans un _secret_ les données sont encodées en base64.
:::

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

La clé `clusters[0].cluster.certificate-authority-data` doit contenir le _CertificateAuthority_ de l’environnent _kubernetes_ au format base64.

La clé `users[0].user.token` doit contenir le token de l'utilisateur non encodé au format base64.

:::info Format YAML

Le format YAML (_YAML Ain't Markup Language_) est largement utilisé pour la configuration dans Kubernetes (et ailleurs).

Sa structure repose sur des clés et des valeurs, organisées de manière hiérarchique grâce à l'**indentation**.  
Il est essentiel d'utiliser des **espaces** pour l'indentation (jamais de tabulations), car une mauvaise indentation peut rendre le fichier invalide.  
Chaque clé est suivie de `:` et peut contenir une valeur simple ou une structure imbriquée.

Il est possible d'accéder à une valeur imbriquée via un « accès à plat » en utilisant la notation pointée, par exemple : `parent.child`.

Exemple :

```yaml
parent:
    child: valeur
    list:
        - item1
        - item2
```

`parent.child.list[0]` vaut `item1`.  

- `parent.child.list` fait référence à la liste entière (`[item1, item2]`)
- `parent.child.list[0]` permet d'accéder au premier élément de cette liste, soit `item1`.
- on pourrait également écrire 
    ```yaml
    parent:
      child: valeur
      list: ['item1', 'item2']
    ```

:::

Il est nécessaire de définir la variable d'environnement `KUBECONFIG` avec le _path_ vers votre fichier de configuration.

|Shell|Commande|
|:--|:--|
|PowerShell|$env:KUBECONFIG = "C:\Users\myuser\kubeconfig-sa-myuser-token.yaml"|
|Bash|export KUBECONFIG=/home/myuser/kubeconfig-sa-myuser-token.yaml|

:::warning Question
Listez les différents _NameSpace_ et _pod_ à l'aide de la commande `kubectl`.
:::

_L'objectif est d'accéder a l'environnement kubernetes depuis un ordinateur disant._

