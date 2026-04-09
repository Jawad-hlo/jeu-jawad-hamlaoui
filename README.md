# Projet Agar.io en p5.js

## Description
Ce projet est une version simple d'Agar.io réalisée avec la bibliothèque JavaScript p5.js. L'objectif est de présenter un jeu où le joueur contrôle un blob qui se déplace avec la souris, mange de la nourriture et peut se diviser en plusieurs fragments.

## Fonctionnalités
- Déplacement du blob principal avec la souris
- Génération automatique de nourriture colorée
- Collision entre le blob et la nourriture
- Croissance du blob après avoir mangé
- Mécanique de division avec la touche `Espace`
- Réunion automatique des fragments après un certain temps
- Effet visuel de division

## Fichiers principaux
- `index.html` : page web principale qui charge la scène et les scripts
- `sketch.js` : logique du jeu, classes et boucle de dessin p5.js
- `style.css` : styles de base pour la page
- `libraries/p5.min.js` : bibliothèque p5.js utilisée pour le rendu et les interactions

## Architecture
Le code est structuré de manière modulaire avec plusieurs classes :
- `Jeu` : gère l'état global, la mise à jour et le rendu
- `Blob` : représente les cellules du joueur, leur déplacement et leur dessin
- `Nourriture` : représente les éléments comestibles présents sur le terrain

## Utilisation
1. Ouvrir `agar.io/index.html` dans un navigateur.
2. Déplacer la souris pour contrôler le blob.
3. Appuyer sur `Espace` pour diviser le blob en plusieurs fragments.

## Objectif pédagogique
Ce projet permet de travailler sur :
- la programmation orientée objet en JavaScript
- l'utilisation de p5.js pour les animations et le rendu graphique
- la gestion des collisions et de l'état de jeu
- la construction d'une interface interactive simple

## Améliorations possibles
- Ajouter des ennemis ou d'autres joueurs
- Ajouter un système de score
- Optimiser la fusion des fragments
- Ajouter des niveaux de difficulté
- Améliorer l'affichage et le design
