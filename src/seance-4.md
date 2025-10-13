# Séance 4

**Pods & deployments**

:::info Objectifs

- Maîtriser les objets _pod_
- Gérer les déploiements (_replica set_, _stateful set_, _daemon set_)
- Scalabilité
- _Port forwarding_ pour voir le pod. 

:::


:::warning Remarque
Il est nécessaire de maîtriser les notions : **déclaratif** _versus_ **impératif**. 

Les tâches suivantes se réaliseront toujours de manière déclarative.
:::

### Tâche 1

Déployez un Pod de manière déclarative _via_ votre accès distant (cfr. tâche 3 de la séance 2) et accédez à son contenu en utilisant la commande `kubectl port-forward`.

|**Exigences**|
|:--|
|L'application dans le conteneur écoute sur le port TCP/5000.
|Exposer ce port interne sur le port TCP/8080 de la machine locale.
|Le conteneur doit être visible dans son navigateur.

:::warning Question
Quelle commande kubectl faut-il utiliser pour accéder à l'application Web dans le pod depuis votre console ?
:::

### Tâche 2

Un [_deployment_](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) est un objet Kubernetes qui gère la création et les mises à jour des Pods. Il garantit l'exécution du nombre souhaité de _replicas_ et gère automatiquement les mises à jour et les _rollbacks_.

Un _deployment_ crée un [_replicaset_](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/) qui crée à son tour les _pods_.

Créez un manifeste YAML déclaratif pour déployer un _deployment_ avec l'image container utilisée précédemment et accédez à son contenu en utilisant la commande [`kubectl port-forward`](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/).

####  Exemple d'un déploiement simple

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
|Le _pod_ doit avoir le label `app: demo` et ce label doit être utilisé dans le _selector_.
|le _deployment_ doit avoir 1 replica.

:::warning Questions
Que peut-on observer comme différence entre un _pod_ créé individuellement — comme à la tâche précédente — d'un _pod_ créé _via_ un _deployment_ ? Quel est le lien avec le _replicaset_ ?
:::

:::warning Question
Quelle commande kubectl faut-il utiliser pour accéder à l'application Web dans le pod — _via_ le _deployment_ — depuis votre console ?
:::

### Tâche 3

Faites varier les paramètres du déploiement de la manière suivante et réalisez quelques observations sur le comportement des _pods_ ainsi que le _replicaset_.

Les [probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) définies sur un  _pod_ permettent à _kubernetes_ d'en connaitre le status.  

|**Exigences**
|:--|
|Le deployment doit maintenant avoir 3 replicas
|Ajoutez le label _environment_ ayant la valeur _labo_ à votre _pod template_
|Ajoutez les probes _liveness_ et _readiness_ sur `/liveness` et `/readiness`.

:::warning Question
Que peut-on observer sur les _replicaset_ et les _pods_ après l'application du changement de paramètre du déploiement ?
:::

:::tip Note sur les probes
Les endpoints `/liveness` et `/readiness` retournent simplement `OK` et `READY` respectivement. 

Pour observer plus clairement le comportement des probes lors du démarrage des pods, vous pouvez modifier les paramètres `initialDelaySeconds` (le temps avant la première vérification) ou `periodSeconds` (le temps entre chaque vérification) dans vos probes pour ralentir leur exécution et pouvoir visualiser l'état.

_Nous reviendrons sur ces concepts plus tard. Actuellement, retenons qu'il faut des probes ; il faut que kubernetes puisse tester l'état de ses pods._
:::

### Tâche 4

Un [_statefulset_](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/) gère des Pods qui sont basés sur une même spécification de conteneur. Contrairement à un _Deployment_, un _StatefulSet_ maintient une identité pour chacun de ces Pods. Ces _Pods_ sont créés à partir de la même spec, mais ne sont pas interchangeables : chacun a un identifiant persistant qu'il garde à travers tous ses _rescheduling_ (reprogrammations).

Créez un manifeste YAML déclaratif pour déployer un _statefulset_ avec l'image container utilisée précédemment et accédez à son contenu en utilisant la commande [`kubectl port-forward`](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/).

|**Exigences**
|:--|
|Le _statefulset_ doit être nommé `<shortname>-sts`, ou `<shortname>` est un placeholder pour votre identifiant utilisateur.
|Le _pod_ doit avoir le label `app: demo` et ce label doit être utilisé dans le _selector_.
|Le _statefulset_ doit avoir 1 replica.
|Les probes _liveness_ et _readiness_ sur `/liveness` et `/readiness` doivent être définies.

:::warning Questions
Que peut-on observer comme différence entre un _pod_ créé _via_ un _deployment_ d'un pod créé via un _statefulset _ ?
:::

### Tâche 5

Faites varier les paramètres du _statefulset_ de la manière suivante et réalisez quelques observations sur le comportement des _pods_.

|**Exigences**
|:--|
|Le _statefulset_ doit maintenant avoir 2 replicas
|Ajoutez le label _environment_ ayant la valeur _labo_ à votre _pod template_

:::warning Question
Que peut-on observer sur les _statefulset_ et les _pods_ après l'application du changement de paramètre du déploiement ?
:::

:::warning Question
Quelle commande kubectl faut-il utiliser pour accéder à l'application Web dans le pod — _via_ le _statefulset_ — depuis votre console ?
:::

### Tâche 6

Reprenez la première tâche de la premiere séance et comparez les variable d’environnement avec un _pod_ scheduler par un _deployment_ ainsi que par un _statefulset_.

:::warning Question
Que peut-on observer comme variables initialisées et valeurs différentes entre les instances du même container ? Quel lien cela a-t-il avec la manière dont le container est déployé ?
:::