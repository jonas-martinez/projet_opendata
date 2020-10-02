# **ACILIM** - Analyse des Constructions en cours et Influence sur L'Immobilier et la Mobilité

## Présentation

Ce projet à pour but de sensibiliser les utilisateurs aux informations démographiques et immobilières de leur région via une carte web permettant de visualiser ces informations.

Ces informations proviennent de l'INSEE qui fournit des données open-source. Dans le cadre de ce projet nous utiliserons des données démographiques (nombre d'habitants, évolution de ce dernier, etc...) ainsi que différentes données immobilières (nombre de construction en cours, développement urbain, variation sur le prix de l'immobilier, etc...).

## Installation de l'environnement de développement

* Installer PostgreSQL et pgAdmin pour gérer la base de données
* Installer Apache pour héberger le site web en local
* Installer l'extension PostGIS pour permettre la prise en charge des données spatiales
* Exécuter les scripts SQL


### Backlog

| ID 	| Description                                                                                                              	| Spécificités Techniques                                                                                    	|
|----	|--------------------------------------------------------------------------------------------------------------------------	|------------------------------------------------------------------------------------------------------------	|
| 1  	| En tant qu'utilisateur je veux pouvoir visionner une carte de la France                                                  	| Création d'un serveur en Php ou Javascript pour servir le produit                                          	|
|    	|                                                                                                                          	| Utilisation de OpenStreetMap pour l'affichage de la carte et des points d'intérêts                         	|
| 2  	| En tant qu'utilisateur je veux pouvoir accéder à toutes les données démographiques, immobilières et construction urbaine 	| Récupération des données des différentes sources d'informations opensource                                 	|
|    	|                                                                                                                          	| Tri des données pertinentes au produits                                                                    	|
|    	|                                                                                                                          	| Utilisation d'une base de données relationnelle pour stocker les informations                              	|
| 3  	| En tant qu'utilisateur je veux pouvoir visionner les contours d'une ville sur la carte                                   	| Utilisation de OpenStreetMap pour la visualisation des données géographiques (QJS)                         	|
| 4  	| En tant qu'utilisateur je veux pouvoir visionner les données des constructions en cours dans ma ville                    	| Utilisation de OpenStreetMap pour la visualisation des données géographiques (QJS)                         	|
| 5  	| En tant qu'utilisateur je veux pouvoir visionner les données de l'évolution du marché de l'immobilier en France          	| Définition d'une fonction qui permet d'obtenir les chiffres concernant l'évolution du prix de l'immobilier 	|
|    	|                                                                                                                          	| Définition d'une fonction permettant d'afficher les statistiques dans une section spécifique               	|
| 6  	| En tant qu'utilisateur je veux pouvoir visonner les informations démographiques pour chaque ville                        	| Affichage d'une info-bulle qui affiche les informations de la ville                                        	|
| 7  	| En tant qu'utilisateur je veux pouvoir connaitre le type de constructions en cours                                       	| Affichage d'une info-bulle qui affiche les informations de la ville                                        	|
| 8  	| En tant qu'utilisateur je veux pouvoir connaitre le prix de l'immobilier par ville                                       	| Affichage d'une info-bulle qui affiche les informations de la ville                                        	|
| 9  	| En tant qu'utilisateur je veux pouvoir visionner des statistiques générales d'une ville                                  	| Affichage d'une info-bulle qui affiche les informations de la ville                                        	|


## Récap

### Récap Semaine 1

Mise en place des outils de communication : discord
Réflexion sur le sujet : objectifs principaux
Création projet git
Début des recherches de sources de données : problème avec données géométriques

### Récap Semaine 2

Globalement manque de temps (journées de cours très chargées) ou décalés selon les parcours
Semaine exclusivement dédiée à l’acquisition de données
Vérifications que les données peuvent être combinées (années similaires)
Extraction des données souhaitées : tri des champs à garder
Mise en place architecture d'accueil de la base de données : nécessite la gestion de données spatiales (PostGis)
Vérification de la lecture des données spatiales
