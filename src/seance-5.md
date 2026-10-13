# Séance 5

**Réseau de base : Service**

> _Les pods Kubernetes sont mortels : ils naissent et meurent. Lorsqu'ils meurent, ils ne ressuscitent pas._ 

Si vous utilisez un déploiement pour exécuter votre application, celui-ci peut créer et détruire dynamiquement des pods. Le déploiement est responsable du maintien du bon nombre de réplicas : il veille à ce que le bon nombre de pods existent. 

Chaque pod obtient sa propre adresse IP, mais dans un déploiement, l'ensemble de pods s'exécutant en un instant peut être différent de l'ensemble de pods exécutant cette application un instant plus tard.

Cela conduit à un problème : si un ensemble de pods (appelons-les « _backends_ ») fournit des fonctionnalités à d'autres pods (appelons-les « _frontends_ ») à l'intérieur de votre cluster, comment les pods _frontends_ peuvent-ils trouver et suivre l'adresse IP à laquelle se connecter, afin que le frontend puisse utiliser la partie backend de la charge de travail?

C'est là où les **services** entrent en jeu.

:::info Objectifs

- Comprendre les différents types de service
- Comprendre les sélecteurs
- _Les pods sont accessibles de l'extérieur via une IP de load balancer sur un port spécifique_
:::

:::warning Remarque
À partir de cette séance, toute création de pod doit être réalisée via un _Deployment_.
:::

## Tâche 1

Vous déployez un web service dans un cluster Kubernetes. Vous voulez l’exposer en interne en utilisant un _Service_.

Un [_Service_](https://kubernetes.io/docs/concepts/services-networking/service/) Kubernetes est une couche d'abstraction qui définit un ensemble de _Pod_ et une règle pour y accéder. Il fournit un endpoint réseau stable ainsi qu’un service de répartition de charge vers les _Pod_ sélectionnés.

:::tip
Le _deployment_ veille au maintient du bon nombre de _pods_ en vie selon l'état souhaité. Le _service_ fournit un point d'accès réseau stable et distribue le trafic vers les _pods_ sélectionnés. 

Les deux objets sont indépendants, mais leurs configurations se complètent.
:::

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

|**Exigences**
|:--
|Le _Service_ doit être de type _ClusterIP_
|Le _Service_ doit exposer le port interne de l'application (TCP/5000) sur le premier port du range qui vous est attribué
|Le _Label_ à utiliser sur le _Pod_ et le _selector_ du _Service_ doivent être *app.kubernetes.io/name* avec la valeur *my-app*

:::warning Questions
Quel est le contenu du fichier YAML pour créer le _Service_ ainsi que le _Deployment_ ?

Quelle commande ```kubectl``` faut-il utiliser pour réaliser un port-foward sur le _Service_ ?
:::

## Tâche 2

Nous voulons exposer les services du cluster avec des IP individuelles : l'utilisatrice _alice_ expose son service avec une IP du _range_ qui lui a été attribué tandis que l'utilisateur _bob_ expose le sien avec une IP de son _range_. Pour ce faire, nous avons besoin d'un composant supplémentaire pour Kubernetes capable de fournir des IP _LoadBalancer_ à un _Service_: **MetalLB**.

:::info
Kubernetes définit le type `LoadBalancer` sans l'implémenter. Dans un cloud public, c'est le fournisseur qui crée le _load balancer_. Sur un _cluster_ bare-metal (ou VM), rien n'est fait (le service reste en `EXTERNAL-IP <pending>`). MetalLB comble ce manque. 
:::

:::warning
Dans le cas particulier de `k3s`, cette tâche est prise en charge par `ServiceLB` en utilisant les adresses IP des nœuds… mais rappelez-vous. Nous avons choisi de le désactiver. 
:::

Installation du composant **MetalLB**.

MetalLB a deux rôles : 
- **attribuer** une IP externe au _Service_. Cette IP sera prise dans un _pool_ d'adresses;
- **annoncer** l'IP sur le réseau.

L'installation est réalisée à l'aide de **Helm** dans le namespace _k8s-infra-metallb_. Il n'y a bien sûr qu'une seule instance MetalLB dans un cluster k8s.

:::tip DÉFINITION
**Helm** est le gestionnaire de paquets de Kubernetes. Il permet d'ajouter un composant à Kubernetes. Plutôt que d'appliquer à la main une série de manifestes YAML (_Deployment_, _Service_, _ConfigMap_…), on installe une application en une seule commande.

Un paquet Helm s'appelle un _chart_. C'est un ensemble de modèles (_templates_) de manifestes Kubernetes, paramétrables par un fichier `values.yaml`. Les _charts_ sont publiés dans des dépôts (_repositories_) que l'on ajoute avec `helm repo add`.

Chaque installation d'un _chart_ dans le cluster crée une _release_, qui porte un nom et un numéro de révision. Helm garde l'historique des _releases_, ce qui permet de mettre à jour (`helm upgrade`), de revenir à une version précédente (`helm rollback`) ou de tout désinstaller proprement (`helm uninstall`).
::: 

Une fois MetalLB installé, il faudra le configurer individuellement: 

- pour l'attribution des adresses IP, nous utilisons `IPAddressPool`.

  :::info
  Un range a été attribué à chaque personne. 
  :::

  :::warning 
  Attention aux _namespaces_ utilisés. 
  :::

- pour l'annonce sur le réseau, il est possible de le faire en de 2 manières : 

  - en mode **L2** — c'est-à-dire en couche 2 — où le nœud répond aux requêtes ARP (IPv4) et NDP (IPv6);
  - en mode **BGP** où MetalLB annonce la route aux routeurs voisins. 

  Dans notre cas, nous ne pouvons faire que le mode **L2** _via_ `L2Advertisement` lié à l'`IPAddressPool` créé précédemment.

:::warning Questions
Comment le namespace adéquat est-il créé ?  
Comment `MetalLB` est-il installé ? 

Quel est le contenu du fichier YAML pour créer la ressource _IPAddressPool_ ainsi que le _L2Advertisement_ ?
:::


## Tâche 3

De manière déclarative, créez un _Service_ qui expose un _Pod_ utilisant l'image [docker.io/patteantoine/5clo1r:tagname](https://docker.io/patteantoine/5clo1r:tagname) permettant d'y accéder via une IP de type _Load Balancer_ faisant partie de votre range.

|**Exigences**
|:--
|Le _Service_ doit être de type _LoadBalancer_
|L'IP LoadBalancer doit provenir de votre range
|Le _Service_ doit exposer le port interne de l'application (TCP/5000) sur le second port du range qui vous est attribué
|Les _Label_ à utiliser sur le _Pod_ et le _selector_ du _Service_ doivent être *app.kubernetes.io/name* avec la valeur *my-app* ainsi que *app.kubernetes.io/service* avec la valeur *by-load-balancer*
|Le ou les _Pod_ de la tâche précédente ne doivent pas être sélectionnés par ce second _Service_

:::warning Questions
Quel est le contenu du fichier yaml pour créer le _Service_ ainsi que le _Deployment_ ?

Quelle commande ```kubectl``` faut-il utiliser pour connaitre les différents endpoints ciblés par le _Service_ ? Expliquez l'output de la commande.

Quelle configuration spécifique faut-il réaliser sur le service pour que l'IP LoadBalancer proviennent de votre range ?

Quelle est l'ip _Load Balancer_ assignée aux services ? Comment la trouve-t-on ? 

Quelle est la différence entre un service de type _ClusterIP_ et un service de type _Load Balancer_ ?
:::

## Tâche 4

Faites varier le nombre de _replicas_ sur votre _Deployment_ précédemment créé.

:::warning Question
Que pouvez-vous observer sur le _Service_ ?
:::
