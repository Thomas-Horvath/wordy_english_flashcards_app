# Wordy

A Wordy egy magyar nyelvű, full-stack szókártyás alkalmazás angol-magyar szócsomagok létrehozására és gyakorlására. A projekt Next.js App Routerre épül, Prisma ORM-et használ, az adatokat pedig SQLite-ban tárolja.

## Jelenlegi állapot

- a projekt `lint`, `test` és `build` szinten ellenőrizve van
- a backend kritikusabb route-jai már tulajdonjog-ellenőrzéssel működnek
- a regisztráció és a csomagszerkesztés központi validációt használ
- a szólista mentése már nem teljes újraépítéssel, hanem diff-alapú frissítéssel történik

## Fő funkciók

- regisztráció és bejelentkezés
- saját session alapú authentikáció HTTP-only cookie-val
- profiloldal alap fiókadatokkal
- jelszó módosítása
- szócsomagok listázása, létrehozása, szerkesztése és törlése
- angol-magyar szópárok kezelése csomagokon belül
- kártyás gyakorló nézet kezdő nyelv választással
- újrakezdés ugyanazzal vagy fordított nyelvi iránnyal
- SQLite adatbázis backup letöltése bejelentkezett felhasználónak

## Tech stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma ORM
- SQLite
- bcryptjs
- react-icons
- clsx
- framer-motion

## Főbb működési elvek

### Auth

- sikeres login után a szerver `Session` rekordot hoz létre
- a token `token` nevű HTTP-only cookie-ban tárolódik
- az auth ellenőrzést a `lib/auth.ts` helperjei végzik
- a kliens az `AuthContext` segítségével szinkronizálja a bejelentkezési állapotot a `/api/profile` végponttal

### Validáció

- a regisztráció, a csomagnév és a szólista validáció közös helperbe került
- az email normalizálva, a szövegek trimelve kerülnek feldolgozásra
- félig kitöltött szómezők mentése nem engedett

### Szólista mentés

- szerkesztéskor a backend összeveti a meglévő és a beküldött kártyákat
- külön kezeli a létrehozandó, módosítandó és törlendő elemeket
- a mentés tranzakcióban fut

## Projektstruktúra

```text
app/
  (auth)/
    login/
    newpassword/
    profil/
    register/
  (pages)/
    cards/[id]/
    packages/
      create/
      edit/[id]/
  api/
    backup/
    cards/[id]/
    change-password/
    groups/
    login/
    logout/
    profile/
    register/
lib/
  auth.ts
  prisma.ts
  validation.ts
  wordPairs.ts
prisma/
  schema.prisma
  seed.js
tests/
  run-tests.ts
```

## Adatmodell

### `User`

- `id`
- `name`
- `email`
- `password`
- `createdAt`

### `Session`

- `id`
- `token`
- `createdAt`
- `expiresAt`
- `userId`

### `WordGroup`

- `id`
- `name`
- `userId`
- `createdAt`

### `WordPair`

- `id`
- `en`
- `hu`
- `groupId`
- `createdAt`

## Oldalak

- `/` landing oldal, bejelentkezve gyors belépéssel a csomagokhoz
- `/login` bejelentkezés
- `/register` regisztráció
- `/profil` profil, kijelentkezés, jelszócsere, backup
- `/newpassword` jelszó módosítása
- `/packages` csomaglista
- `/packages/create` új csomag létrehozása
- `/packages/edit/[id]` csomag és szavak szerkesztése
- `/cards/[id]` gyakorló nézet

## API végpontok

### Auth

- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/profile`
- `POST /api/change-password`

### Szócsomagok és szavak

- `GET /api/groups`
- `POST /api/groups`
- `POST /api/groups/new`
- `GET /api/groups/[id]`
- `PUT /api/groups/[id]`
- `DELETE /api/groups/[id]`
- `DELETE /api/cards/[id]`

### Backup

- `GET /api/backup`

## Telepítés

### 1. Függőségek telepítése

```bash
npm install
```

### 2. Környezeti változó

`.env`:

```env
DATABASE_URL="file:./flashcardsDb.db"
```

Ez a Prisma számára a `prisma/flashcardsDb.db` SQLite fájlt jelenti.

### 3. Adatbázis migráció

```bash
npx prisma migrate dev
```

### 4. Opcionális seed

```bash
npx prisma db seed
```

### 5. Fejlesztői szerver indítása

```bash
npm run dev
```

Alapértelmezett cím:

```text
http://localhost:3000
```

## Elérhető scriptek

```bash
npm run dev
npm run lint
npm run test
npm run build
npm run start
```

## Ellenőrzések

```bash
npm run lint
npm run test
npm run build
```

A `test` script jelenleg a tiszta üzleti logikát ellenőrzi:

- regisztrációs validáció
- csomagnév validáció
- szókártyák tisztítása és ellenőrzése
- kártya diff-terv generálása

## Biztonsági és backend javítások

- a `/api/groups/[id]` route csak a bejelentkezett felhasználó saját csomagjait kezeli
- a `/api/cards/[id]` törlés csak saját csomaghoz tartozó szóra működik
- a `/api/backup` végpont auth-ellenőrzést kapott
- a regisztráció duplikált emailre `409` választ ad
- a backend értelmezhető validációs hibákat küld vissza

## Ismert korlátok

- a jelenlegi tesztek még csak a tiszta üzleti logikát fedik le, nincs route- vagy UI-szintű tesztelés
- a backup a teljes SQLite adatbázisfájlt tölti le, ezért ez inkább admin jellegű funkció, mint finoman szabályozott export
- a jelszó- és auth-folyamatok működnek, de még nincs rate limit vagy brute-force védelem
- a kliensoldali hibakezelés több helyen még `alert` alapú

## Hasznos fájlok

- `package.json`
- `lib/auth.ts`
- `lib/validation.ts`
- `lib/wordPairs.ts`
- `app/context/AuthContext.tsx`
- `app/api/groups/[id]/route.ts`
- `app/api/cards/[id]/route.ts`
- `app/api/backup/route.ts`
- `prisma/schema.prisma`
