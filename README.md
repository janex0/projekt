# Recepti

Recepti je spletna aplikacija, namenjena pregledovanju in dodajanju kuharskih receptov.  
Uporabnikom omogoča enostavno iskanje receptov, dodajanje lastnih receptov ter upravljanje svojega profila.

Aplikacija je zasnovana kot sodobna spletna rešitev z uporabo aktualnih tehnologij in preglednega uporabniškega vmesnika.

---

## Tehnologije

Projekt je razvit z uporabo naslednjih tehnologij:

- **Next.js** – frontend in backend (API poti)
- **React** – uporabniški vmesnik
- **TypeScript** – varnejša in bolj berljiva koda
- **PostgreSQL** – baza podatkov za shranjevanje uporabnikov in receptov
- **JWT** – avtentikacija uporabnikov
- **Google OAuth** – prijava z Google računom
- **Tailwind CSS** – oblikovanje uporabniškega vmesnika

---

## Funkcionalnosti

### Prijava in registracija
Uporabniki se lahko:
- registrirajo z e-pošto in geslom,
- prijavijo z Google računom.

Po prijavi se ustvari seja z uporabo JWT žetona.

---

### Upravljanje receptov
Prijavljen uporabnik lahko:
- pregleda vse recepte,
- doda nov recept,
- vnese sestavine in postopek priprave,
- pregleda svoje dodane recepte.

---

### Uporabniški profil
Vsak uporabnik ima svoj profil, kjer lahko:
- vidi svoje osnovne podatke,
- pregleda recepte, ki jih je dodal.

Administrator ima dostop do administrativnega pogleda za upravljanje uporabnikov in vsebine.

---

## Varnost

Aplikacija vključuje:
- zaščiten dostop do strani,
- preverjanje uporabniških pravic,
- varno shranjevanje gesel (hashiranje),
- zaščitene API poti.

---

## Zaključek

Projekt Recepti predstavlja sodobno spletno aplikacijo za upravljanje in deljenje kuharskih receptov.
Aplikacija je primer praktične uporabe modernih spletnih tehnologij v realnem projektu.
