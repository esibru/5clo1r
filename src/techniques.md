## Container
- Image : [docker.io/5clo1r/k8s-labo](docker.io/5clo1r/k8s-labo) 
- Tag : 0.1.0

## Probes
### Liveness
- path : /liveness
- port : http tcp/5000

### Readiness
- path : /readiness
- port : http tcp/5000

## Documentation

### Resources K8S

- Pod : https://kubernetes.io/docs/concepts/workloads/pods/
- Deployment : https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
- StateFulSet : https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/
- Service : https://kubernetes.io/docs/concepts/services-networking/service/
- Volume : https://kubernetes.io/docs/concepts/storage/volumes/
- PersistentVolumeClaims : https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims

### cli - kubectl
- téléchargement : https://kubernetes.io/docs/tasks/tools/#kubectl
- reference : https://kubernetes.io/docs/reference/kubectl/

### Troubleshooting

- Pod : https://kubernetes.io/docs/tasks/debug/debug-application/debug-pods/
- Services : https://kubernetes.io/docs/tasks/debug/debug-application/debug-service/
- StateFulSet : https://kubernetes.io/docs/tasks/debug/debug-application/debug-statefulset/
- Running Pods : https://kubernetes.io/docs/tasks/debug/debug-application/debug-statefulset/
- Get a Shell to a Running Container : https://kubernetes.io/docs/tasks/debug/debug-application/get-shell-running-container/
