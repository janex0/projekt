# Testiranje Prijave in Registracije

Projekt ima obsežno testno pokritje za avtentifikacijske funkcionalnosti.

## Testne Datoteke

### 1. **API Testi**

#### `app/api/auth/__tests__/register.test.ts`
Testi za registracijski API endpoint (`POST /api/auth/register`):
- ✅ Uspešna registracija z veljavnimi podatki
- ✅ Heširanje gesla s bcrypt
- ✅ Validacija vhodnih podatkov (email, geslo)
- ✅ Preverjanje obstoječega uporabnika
- ✅ Privzete vrednosti (role = USER)

#### `app/api/auth/__tests__/nextauth.test.ts`
Testi za NextAuth Credentials Provider:
- ✅ Avtorizacija z pravilnim emailom in geslom
- ✅ Preverjanje neobstoječega uporabnika
- ✅ Napačno geslo
- ✅ Manjkajoči podatki (email/geslo)
- ✅ Primerjava gesel s bcryptjs
- ✅ Google OAuth korisniki (brez gesla)
- ✅ Oblikovanje podatkov uporabnika (string ID)

### 2. **Component Testi**

#### `app/__tests__/login.test.tsx`
Testi za LoginPage komponent:
- ✅ Prikaz forme s polji email in geslo
- ✅ Prikaz gumb za prijavo
- ✅ Prikaz Google OAuth gumba
- ✅ Oddaja forme s sigIn()
- ✅ Stanje nalaganja med oddajo
- ✅ Preusmerjanje na home po uspešni prijavi
- ✅ Prikazovanje napak pri napačnih podatkih
- ✅ Čiščenje napak pri novi oddaji
- ✅ Google OAuth akcije
- ✅ Validacija input polj

#### `app/__tests__/signup.test.tsx`
Testi za SignupPage komponent:
- ✅ Prikaz forme s polji ime, email, geslo
- ✅ Oddaja na `/api/signup` endpoint
- ✅ Stanje nalaganja
- ✅ Avtomatska prijava po uspešni registraciji
- ✅ Prikazovanje napak pri registraciji
- ✅ Preverjanje obstoječega uporabnika
- ✅ Čiščenje napak pri novi oddaji
- ✅ Google OAuth akcije
- ✅ Upravljanje stanja forme

## Poganjanje Testov

### Vsi Testi
```bash
npm test
```

### Testi v Watch Modu
```bash
npm run test:watch
```

### Pokritost (Coverage)
```bash
npm run test:coverage
```

### Specifični Testni Datoteki
```bash
npm test -- register.test.ts
npm test -- login.test.tsx
npm test -- signup.test.tsx
npm test -- nextauth.test.ts
```

### Verbose Output
```bash
npm test -- --verbose
```

## Testna Pokritost

Projekt pokriva:
- **Registracija**: Validacija, heširanje, duplikati, privzete vrednosti
- **Prijava**: Kredenciali, lozavke, stanja, napake
- **NextAuth**: Avtorizacija, gesla, OAuth, podatki
- **UI Komponente**: Prikaz, interakcije, stanja, napake

## Struktura Testov

Testi so organizirani po kategorijah:
```
✓ Renderiranje in Prikaz
✓ Oddaja Forme in Valdiacija
✓ Upravljanje Napak
✓ Avtentifikacija (OAuth)
✓ Stanja Aplikacije
✓ Primerjava Funkcionalnosti
```

## Mock Podatki

Vsi testi uporabljajo mock podatke in ne komunikirajo s pravo bazo:
- Prisma: `@prisma/client` je mockirana
- NextAuth: `next-auth/react` je mockirana
- Fetch: `global.fetch` je mockirana

## CI/CD Integracija

V skripte (`package.json`) so vključeni:
```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

## Dodatne Informacije

- **Jest Verzija**: Najnovejša (avtomatsko nameščena)
- **Testing Library**: Za React komponente
- **jest-mock-extended**: Za napredne mock funkcionalnosti
- **node-mocks-http**: Za HTTP request/response mock-iranje
