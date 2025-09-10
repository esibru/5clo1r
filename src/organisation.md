# Organisation 

_organisation des cours / labos_

[Fiche ECTS](ects.md)


## Planning


| Séance | Thème de la Séance | Objectifs d'Apprentissage | Activité Pratique (Lab) |
| :---: | :--- | :--- | :--- |
| **1** | **Introduction à la Conteneurisation et Kubernetes** | Comprendre les conteneurs. Différencier VM et conteneur. Découvrir l'orchestration. Comprendre l'architecture K8s (et Minikube).| Installer Minikube. |
| **2** | **Installation de k3s** | _Avoir un k3s et un pod qui tourne_| Installer k3s sur le serveur du groupe. Lancer un premier _pod_
| **3** | **Pods & Deployments** | Maitriser les objets Pod et Deployment. Gérer le state. (replicat set, statefull set, daemon set). Scalability | Créer des Pods et des Deployments en YAML. Scaler. Ajouter port forward pour voir le pod |
| **4** | **Services & accès** | _Trouver le service_ Exposer des applications. Donner une IP et un port forwarding. Utiliser les labels et **selectors**. | Créer des Services (ClusterIP (ip interne donc port forward), NodePort (port binder sur le worker)). |
| **5** | **Réseau Avancé : Ingress** | Gérer le trafic entrant. Comprendre les Ingress Controllers. | Déployer un Ingress pour router le trafic vers 2 services. _Le pod est accessible de l'extérieur_|
| **6** | **Configuration & Secrets** | Gérer la configuration (ConfigMaps) et les secrets. | Injecter des variables et des fichiers de configuration. _Utilisation d'une image par couleur. ensuite la couleur sera passée au conteneur en tant que variable_|
| **7** | **Stockage Persistent** | Comprendre la gestion du stockage (PV, PVC, StorageClass). | Monter un volume persistent dans un Pod. |
| **8** | **Gestion de paquets helm** (moteur de template écrit en go) et **CI/DI** ||
| **9** à **12** | **Petit projet de synthèse** ||

un pod est la plus petite unité. un pod contient des conteneurs. 
configmap (fichier yaml) ou variable d'environnement

prévoir la documentation quelque part



**Total :** 24 heures de formation


