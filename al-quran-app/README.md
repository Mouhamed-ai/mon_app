# Al-Quran App

Socle full-stack Next.js 15 + TypeScript + Prisma + PostgreSQL, conçu pour évoluer vers une application mobile Expo.

## Démarrage

```bash
cp .env.example .env
docker compose up -d db
npm install
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

Ouvrez `http://localhost:3000`. L’API expose notamment `GET /api/surahs` et `POST /api/auth/register`.

## Architecture

- `src/app` : pages Next.js et routes API
- `src/lib` : accès base, JWT et validation
- `prisma` : schéma PostgreSQL, données initiales
- `docker-compose.yml` : environnement local de production

Les données complètes du Coran, traductions et tafsirs doivent être importées depuis des sources licenciées et vérifiées avant mise en production.
