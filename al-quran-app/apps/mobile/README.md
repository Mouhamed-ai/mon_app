# Client mobile futur (Expo)

Ce dossier est réservé à une application React Native / Expo. Le client mobile consommera les mêmes routes REST que le web (`/api/surahs`, `/api/auth/*`) et partagera à terme les schémas Zod, les types et la logique de progression dans un package commun.

L’authentification mobile utilisera un stockage sécurisé pour le jeton, et les téléchargements audio seront gérés par le système de fichiers Expo.
