# Organisation 

_organisation des cours / labos_

[Fiche ECTS](ects.md)




_**À travailler / casser**_


### base très incomplète (_pbt_)

| Séance | Titre            | Concepts 
|--      |--                |--
|1       |Présentation _k8s_|Présentation de _k8s_ et historique
|2       |Minicude          | Installation et rapide prise en main pour pouvoir faire l'install à la maison
|3       | Un premier _pod_ | 
|4       | Un _pod_ avec persistance |
|5       | Secret et config map
|6       | ingress
| | **?**  | 


### autre proposition 


| Séance | Module | Thème de la Séance | Objectifs d'Apprentissage | Activité Pratique (Lab) |
| :---: | :---: | :--- | :--- | :--- |
| **1** | 1 | **Introduction à la Conteneurisation** | Comprendre les conteneurs. Différencier VM et conteneur. | Écrire un Dockerfile, builder et lancer une image. |
| **2** | 1 | **Introduction à Kubernetes** | Découvrir l'orchestration. Comprendre l'architecture K8s. | Installer kubectl & Minikube. Explorer un cluster local. |
| **3** | 1 | **Pods & Deployments** | Maîtriser les objets Pod et Deployment. Gérer le state. | Créer des Pods et des Deployments en YAML. Scaler. |
| **4** | 2 | **Services & Découverte** | Exposer des applications. Utiliser les labels et selectors. | Créer des Services (ClusterIP, NodePort). |
| **5** | 2 | **Configuration & Secrets** | Gérer la configuration (ConfigMaps) et les secrets. | Injecter des variables et des fichiers de configuration. |
| **6** | 2 | **Stockage Persistent** | Comprendre la gestion du stockage (PV, PVC, StorageClass). | Monter un volume persistent dans un Pod. |
| **7** | 3 | **Introduction au Cloud (AKS)** | Découvrir les services K8s managés. | Créer un cluster AKS. Se connecter avec kubectl. |
| **8** | 3 | **Réseau Avancé : Ingress** | Gérer le trafic entrant. Comprendre les Ingress Controllers. | Déployer un Ingress pour router le trafic vers 2 services. |
| **9** | 3 | **Sécurité : RBAC & Policies** | Gérer les accès (RBAC). Isoler les Pods (Network Policies). | Créer un utilisateur avec droits limités. Isoler un Pod. |
| **10** | 4 | **Gestion de Paquets avec Helm** | Simplifier les déploiements complexes avec Helm. | Installer une application (e.g., WordPress) via un Chart Helm. |
| **11** | 4 | **Infrastructure as Code (IaC)** | Provisionner l'infrastructure de manière déclarative. | Écrire un script Terraform pour créer un cluster AKS. |
| **12** | 4 | **CI/CD & Projet de Synthèse** | Construire un pipeline CI/CD complet. | Pipeline GitHub Actions : build -> push -> deploy. |

### proposition de chatgpt

| Séance | Titre | Durée | Concepts clés |
|--------|-------|-------|---------------|
| 1 | Introduction à la Conteneurisation | 2h | Docker, conteneurs vs VM, Dockerfile, Registry |
| 2 | Introduction à Kubernetes | 2h | Orchestration, architecture K8s, kubectl, minikube |
| 3 | Les Objets Fondamentaux : Pods & Deployments | 2h | Pods, YAML, Deployments, auto-réparation |
| 4 | Services & Découverte d'Applications | 2h | Services, exposition d'applications, load balancing |
| 5 | Configuration et Secrets | 2h | ConfigMaps, Secrets, variables d'environnement |
| 6 | Stockage Persistent | 2h | Volumes, PersistentVolumes, PersistentVolumeClaims |
| 7 | Introduction à Azure Kubernetes Service (AKS) | 2h | Cloud, AKS, gestion des clusters managés |
| 8 | Réseau Avancé : Ingress | 2h | Ingress Controllers, routage HTTP/HTTPS |
| 9 | Sécurité : RBAC & Policies | 2h | Authentification, autorisation, politiques de sécurité |
| 10 | Gestion de Paquets avec Helm | 2h | Helm charts, templates, déploiements complexes |
| 11 | Infrastructure as Code avec Terraform | 2h | IaC, provisioning automatisé, Azure integration |
| 12 | CI/CD & Projet de Synthèse | 2h | Pipeline DevOps, projet final, intégration continue |

**Total :** 24 heures de formation


