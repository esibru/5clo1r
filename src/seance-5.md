# Séance 5

**Réseau de base : Service**

```tip
Les Pods Kubernetes sont mortels. Ils naissent et lorsqu'ils meurent, ils ne ressuscitent pas. Si vous utilisez un Déploiement pour exécuter votre application, il peut créer et détruire dynamiquement des pods.

Chaque pod obtient sa propre adresse IP, mais dans un déploiement, l'ensemble de pods s'exécutant en un instant peut être différent de l'ensemble de pods exécutant cette application un instant plus tard.

Cela conduit à un problème: si un ensemble de pods (appelez-les «backends») fournit des fonctionnalités à d'autres pods (appelez-les «frontends») à l'intérieur de votre cluster, comment les frontends peuvent-ils trouver et suivre l'adresse IP à laquelle se connecter, afin que le frontend puisse utiliser la partie backend de la charge de travail?

C'est là où les Services rentrent en jeu.
```

- Comprendre les différents types de service
- Comprendre les sélecteurs
- _Les pods sont accessibles de l'extérieur via une IP de Load Balancer sur un port spécifique_

:::warning Remarque
À partir de cette séance, toute création de Pod doit être réalisée via un Deployment.
:::

## Tâche 1

Vous déployez un web service dans un cluster Kubernetes. Vous voulez l’exposer en interne en utilisant un Service
.

Un _Service_ Kubernetes est une couche d'abstraction qui définit un ensemble de _Pod_ et une règle pour y accéder. Il fournit un endpoint réseau stable ainsi qu’un service de répartition de charge vers les _Pod_ sélectionnés.

De manière déclarative, créez un _Service_ qui expose un _Pod_ utilisant l’image [docker.io/patteantoine/5clo1r:tagname](docker.io/patteantoine/5clo1r:tagname)

### Exemple d'un service simple de type _ClusterIP_

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: ClusterIP
```

|**Exigences
|:--
|Le _Service_ doit être de type _ClusterIP_
|Le _Service_ doit exposé le port interne de l'application (TCP/5000) sur le premier port du range qui vous est attribué
|Le _Label_ à utiliser sur le _Pod_ et le _selector_ du _Service_ doit être *app.kubernetes.io/name* avec la valeur *my-app*

:::warning Questions
Quel est le contenu du fichier YAML pour crée le _Service_ ainsi que le _Deployment_ ?

Quel commande ```kubectl``` faut-il utiliser pour réaliser un port-foward sur le _Service_
:::


## Tâche 2

De manière déclarative, créez un _Service_ qui expose un _Pod_ utilisant l'image [docker.io/patteantoine/5clo1r:tagname](docker.io/patteantoine/5clo1r:tagname) permettant d'y accèder via une IP de type _Load Balancer_.

|**Exigences
|:--
|Le _Service_ doit être de type _LoadBalancer_
|Le _Service_ doit exposé le port interne de l'application (TCP/5000) sur le second port du range qui vous est attribué
|Les _Label_ à utiliser sur le _Pod_ et le _selector_ du _Service_ doivent être *app.kubernetes.io/name* avec la valeur *my-app* ainsi que *app.kubernetes.io/service* avec la valeur *by-load-balancer*
|Le ou les _Pod_ de la tâche précedente ne doivent pas être sélectionné par ce second _Service_

:::warning Questions
Quel est le contenu du fichier yaml pour créer le _Service_ ainsi que le _Deployment_ ?

Quel commande ```kubectl``` faut-il utiliser pour connaitre les différent endpoint ciblés par le _Service_ ? Expliquez l'output de la commande.

Quel est l'ip _Load Balancer_ assigné aux service ? Comment la trouves-t-on ?

Quel est la différence entre un service de type _ClusterIP_ et un service de type _Load Balancer_ ?
:::

## Tâche 3

Faites varier le nombre de _replicas_ sur votre _Deployment_ précédement crée.

:::warning Questions
Que pouvez-vous observer sur le _Service_ ?
:::
