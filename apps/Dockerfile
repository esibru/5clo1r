# Étape 1 : utiliser l'image officielle Python
FROM python:3.11-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers requirements.txt et le reste du projet
COPY requirements.txt .
COPY app ./app

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Exposer le port de l'application Flask
EXPOSE 5000

# Définir les variables d'environnement par défaut
ENV FLASK_APP=app/app
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000
ENV BACKGROUND_COLOR=white

# Commande pour lancer l'application
CMD ["flask", "run"]
