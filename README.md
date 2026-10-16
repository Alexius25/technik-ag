# Technik AG Webseite

Dies ist die Git-Repo für die Webseite der Technik AG des Solitude-Gymnasiums Stuttgart Weilimdorf.


## Stack
- Next.js
- Tailwind CSS
- TypeScript
- Better Auth

## Installation

1. Abhängigkeiten installieren:

```bash
npm install
```

2. DB mit Better Auth einrichten:

```bash
npx auth@latest generate
npx auth@latest migrate
```

3. Drizzle ORM einrichten:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
``` 

4. Lokalen Server starten:

```bash
npm run dev
```