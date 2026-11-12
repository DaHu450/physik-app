# Physik-App – Anleitung

## Was ist drin

| Datei | Wofür |
|---|---|
| `index.html` | Die Schüler-App (Code-Anmeldung, Module, Speichern, Abgeben, Rückmeldung) |
| `lehrer.html` | Deine Auswertung (Codes erzeugen, Abgaben einlesen, Rückmeldung schreiben) |
| `module/module.json` | **Hier schaltest du frei**, was die Schüler sehen |
| `module/*.html` | Die einzelnen Module (deine Artefakte) |
| `bridge.js`, `gemeinsam.js`, `sw.js`, `manifest.webmanifest`, `icons/` | Technik, nicht anfassen |

## Einmalig: auf GitHub Pages stellen

1. Auf github.com ein neues Repository anlegen, z. B. `physik-app` (Public).
2. „Add file → Upload files“: den **Inhalt** des Ordners hochladen (nicht den Ordner selbst), „Commit changes“.
3. Settings → Pages → Source: „Deploy from a branch“, Branch `main`, Ordner `/ (root)` → Save.
4. Nach 1–2 Minuten läuft die App unter `https://DEINNAME.github.io/physik-app/`.
   - Schüler-Link: `…/physik-app/`
   - Dein Link: `…/physik-app/lehrer.html` (nicht an die Schüler geben)

## Schüler einrichten

1. `lehrer.html` öffnen → „Klassen & Codes“ → Namen einfügen → „Codes erzeugen“ → „Code-Kärtchen drucken“.
2. Schüler öffnen den Link **in Safari** → Teilen → „Zum Home-Bildschirm“ → App über das Symbol öffnen → Code eingeben.
   In Safari selbst erscheint nur die Installationsanleitung, kein Codefeld.
3. Der Code wird **einmal** eingegeben und bestätigt. Danach ist die App fest damit verbunden: kein Abmelden, kein Wechsel.

### Kontrolle gegen Code-Tausch
Jede Installation hat eine eigene Geräte-Kennung, die in jeder Abgabe steckt. Die Auswertung zeigt ⚠️, wenn
- **ein Tablet mehrere Codes** abgibt (Tausch oder fremder Code), oder
- **ein Code von mehreren Tablets** kommt (neues Tablet, App gelöscht und neu installiert, oder jemand anderes nutzt den Code).

Ganz verhindern lässt sich eine Neuinstallation technisch nicht (wer die App löscht, löscht auch die Sperre), aber du siehst es immer.

### Selbst testen im Browser
`…/physik-app/?vorschau=1` öffnen: Dann geht die Code-Eingabe auch ohne Installation, und unter „Mehr“ gibt es „Vorschau zurücksetzen“. Abgaben aus der Vorschau werden in der Auswertung als solche gemeldet.

## Neues Modul freischalten

1. Artefakt-HTML als neue Datei in `module/` hochladen (die Anbindung an die App baut Claude ein).
2. In `module/module.json` einen Eintrag ergänzen bzw. `"freigegeben": true` setzen.
3. Beim nächsten Öffnen mit Internet taucht es bei den Schülern auf.

Neue Klasse: in `module.json` unter `"klassen"` eintragen, z. B. `"22": "TG2.2"`. Die Zahl sind die ersten zwei Ziffern der Codes dieser Klasse.

## Abgabe und Rückmeldung

- Schüler: „Abgeben“ → Datei erstellen → im Teilen-Menü Nextcloud → in deinen Abgabe-Ordner.
- Du: alle Dateien aus dem Ordner in `lehrer.html` ziehen → Übersicht → Feld anklicken → Stand ansehen, Rückmeldung schreiben.
- „Rückmeldungsdatei erstellen“ → in einen Nextcloud-Ordner legen, den die Klasse sieht. Schüler: „Mehr → Rückmeldung laden“. Jeder sieht nur seine eigene (verschlüsselt mit seinem Code).

## Datenschutz

In der App und in den Abgabe-Dateien stehen keine Namen, nur Codes. Die Zuordnung Code ↔ Name liegt nur in deinem Browser (`lehrer.html`). Regelmäßig unter „Sicherung“ herunterladen.
