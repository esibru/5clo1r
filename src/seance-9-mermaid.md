```mermaid
graph TB
    Ingress[Ingress <br/>name.grpi.in.esigoto.info] 
    Service[Service WP]
    WP[WordPress]

    Ingress --> |HTTP HTTPS| Service
    Service --> WP
    WP --> CM
    WP --> Secret

    Service2[Service MYSQL]
    LoadBalancer --> Service2
    Service2 --> MYSQL
    MYSQL --> CM
    MYSQL --> Secret
    MYSQL --> PVC

    CM[ConfigMap]
    Secret
    PVC[PersistentVolumeClaim]
```