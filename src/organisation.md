# Organisation 

_organisation des cours / labos_

Chaque séance est constituée d'une présentation de la séance avec, éventuellement, une présentation théorique et de diverses tâches à faire. 

Le planning informatif se trouve ci-dessous, les tâches à faire dans les différentes sections _Séance `i`_. 

[Fiche ECTS](https://ects.esi-bru.be/online/cours/ac2526_5clo1r_5clo1r.html)

:::danger
Nous demandons de tenir à jour un rapport d'activités au fur et à mesure des séances. 
:::

## Rapport

Le rapport contient vos notes au fur et à mesure des séances. Il est à la fois votre outil d'apprentissage et — une partie — de notre outil d'évaluation. En ce sens, il devra avoir cette forme : c'est un fichier au format _markdown_ correctement structuré et facilement lisible. Les fichiers YAML que vous écrirez s'y retrouvent soit tels quels, soit sous forme de liens (et surement pas sous forme de _screenshots_).

Un dépôt _git_ sera créé pour vous afin d'y déposer votre rapport. Puisque votre rapport se crée au fur et à mesure des séances, il ne fera pas l'objet d'un unique _commit_ mais bien d'un commit par séance de travail. 

|**Exigences**
|:--
|Un seul fichier _markdown_ idéalement nommé `README.md`
|Le rapport est **structuré** avec des titres de différents niveaux
|Les configurations YAML sont soit inclues (entre balises ` ```yaml ``` `) ou _via_ un lien
|Le rapport est remis _avant_ la date butoir et fait l'objet d'un _commit_ par séance de travail
|Le rapport se trouve dans la branche `main` du dépôt qui vous a été attribué
|Les messages de _commit_ suivent la recommandation _imperative mood_ (impératif présent et sont en anglais)


https://docs.framasoft.org/fr/grav/markdown.html
https://blog.namok.be/2013-11-19-billet-markdown.html
https://daringfireball.net/projects/markdown/syntax
https://www.ionos.fr/digitalguide/sites-internet/developpement-web/markdown/



## Planning


| Séance | Thème de la Séance | Objectifs d'Apprentissage | Activité Pratique (Lab) |
| :---: | :--- | :--- | :--- |
| **1** | **Introduction à la conteneurisation et Kubernetes** | Comprendre les conteneurs. <br/>Différencier VM et conteneur. <br/>Découvrir l'orchestration. <br/>Comprendre l'architecture K8s (et Minikube).| Installer Minikube sur sa machine perso. |
| **2** | **Installation de k3s** | _Avoir un k3s et un pod qui tournent_| Installer k3s sur le serveur du groupe. Lancer un premier individuellement un premier _pod_
| **3** | **Accèes distant** | Mettre en place l'accès distant via k8s via un token. Création du _namespace_ personnel et lancer un premier _pod_
| **4** | **_Pods & deployments_** | Maitriser les objets de type (_kind_) _pod_ et _deployment_. <br/>Gérer l'état (_state_). <br/>Mise à l'échelle (_scalability_) | Créer des _pods_ et des  _deployments_ en YAML. <br/>Mettre à l'échelle (_scaler_). Ajouter _port forward_ pour accéder aux _pods_ créés|
| **5** | **Services & accès** | Exposer des applications. <br/>Donner une IP et un _port forwarding_. <br/>Utiliser les labels et des sélecteurs (_selectors_). | Créer des Services (`ClusterIP`, `NodePort`). |
| **6** | **Réseau avancé : ingress** | Gérer le trafic entrant et comprendre les _Ingress controllers_. | Déployer un _ingress_ pour router le trafic vers 2 services. _Le pod est accessible de l'extérieur_|
| **7** | **Stockage Persistent** | Comprendre la gestion du stockage (PV, PVC, StorageClass). | Monter un volume persistent dans un Pod. |
| **8** | **Configuration & secrets** | Gérer la configuration (`ConfigMaps`) et les secrets. | Injecter des variables et des fichiers de configuration. |
| **9** à **12** | **Petit projet de synthèse** ||_à déterminer_

**Total :** 24 heures de formation


