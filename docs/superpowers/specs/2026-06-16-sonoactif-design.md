# SonoActif — Sonomètre pour UtilActif
**Date :** 2026-06-16  
**Statut :** Validé

## Objectif

Ajouter un sonomètre à UtilActif permettant à l'enseignant de gérer le niveau sonore de la classe en temps réel, avec un retour visuel engageant projeté au tableau.

## Fonctionnement technique

- API Web Audio (`AudioContext` + `AnalyserNode`) — mesure en continu (~10 fois/seconde)
- Niveau converti en dB relatif (0–100 normalisé)
- Tout en local dans le navigateur, aucun serveur, aucune donnée sauvegardée
- Gestion de la permission microphone : demande explicite au lancement, message d'erreur clair si refusée

## Mascotte — Monstre rigolo (SVG animé)

4 états progressifs selon le niveau sonore mesuré :

| État | Niveau | Apparence |
|------|--------|-----------|
| **Zen** | Silence | Sourire, yeux mi-clos, couleur douce |
| **Éveillé** | Chuchotement | Yeux ouverts, sourcils levés |
| **Agité** | Travail de groupe | Grimace, oreilles dressées, frémissement |
| **Explosé** | Trop bruyant (seuil dépassé) | Se bouche les oreilles, yeux exorbités, animation shake + flash rouge |

Transitions fluides entre états via CSS transition.

### Alerte seuil dépassé
- Grand texte centré **"TROP FORT !"** avec fond rouge semi-transparent plein écran
- Disparaît automatiquement après 3 secondes ou sur clic

## Préréglages

4 boutons fixes sélectionnables à la volée pendant la séance :

| Préréglage | Seuil | Usage |
|------------|-------|-------|
| Silence | Très bas | Lecture individuelle, examen |
| Chuchotement | Bas | Travail en binôme discret |
| Travail de groupe | Moyen | Ateliers, coopératif |
| Libre | Désactivé | Affichage seul, pas d'alerte |

- Préréglage actif mis en évidence visuellement
- Changement instantané sans interrompre la mesure

## Intégration dans UtilActif

### Fichiers à créer
- `src/tools/Sono/Sono.jsx` — composant principal (mesure, états, préréglages, alerte)
- `src/tools/Sono/SonoMonster.jsx` — SVG du monstre avec props d'état

### Fichiers à modifier
- `src/App.jsx` — ajouter `sono` dans `TOOL_COMPONENTS`
- `src/components/ToolGrid.jsx` — ajouter la carte (icône micro, label "Sonomètre")

### Contraintes
- Aucune dépendance externe ajoutée
- Aucune donnée utilisateur ou niveau sonore sauvegardée
- Branding PLAI : teal `#0a9370`, orange `#f97316`, police Inter
