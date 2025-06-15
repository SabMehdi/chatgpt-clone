
# Chatgpt clone

Ce document fournit des instructions sur comment exécuter l'application Keiken sur votre machine en utilisant Docker.

## Prérequis

 - [Docker ](https://www.docker.com/products/docker-desktop/)


## Étapes pour lancer l'application

#### Démarrer Docker:
Assurez-vous que Docker est en cours d'exécution sur votre machine.

#### Cloner le dépôt:
Clonez le dépôt Git de l'application Keiken sur votre machine en utilisant la commande suivante :
```bash
 git clone https://github.com/SabMehdi/keiken.git
```
#### Ajouter la clé API OpenAI:
Ouvrez le fichier \backend\\.env et ajouter la clé fournie.
#### Construire l'image Docker du backend:
Utilisez la commande cd pour naviguer vers le dossier backend de l'application et xécutez la commande suivante pour construire l'image Docker du backend :

```bash
 docker build -t keikenbackend .
```
#### Construire l'image Docker du frontend:

Utilisez la commande cd pour naviguer vers le dossier frontend et exécutez la commande suivante pour construire l'image Docker du frontend :

```bash
 docker build -t keikenfrontend .
```

#### Lancer l'application avec Docker Compose:

Retournez au dossier racine de l'application et utilisez la commande suivante pour lancer l'application :



```bash
 docker-compose up --build
```
## Accès à l'application

 - Le frontend de l'application sera accessible via http://localhost:3000.
 - Le backend de l'application sera accessible via http://localhost:5000.

