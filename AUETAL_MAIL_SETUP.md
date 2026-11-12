# Auetal · E-Mail-Modul (Freigabe-Branch)

Das Postfach marketing@seniorenheim-auetal.de wird ausschließlich über den bestehenden geschützten Admin-Login von Auetal angezeigt.

## Funktionen
- IMAP: die letzten 40 Posteingangs-Nachrichten lesen, Details / reinen Text anzeigen.
- SMTP: neue Nachrichten senden und mit In-Reply-To antworten.
- Serverseitige, durch die bestehende Session geschützte API: `/api/admin/mail`.
- Nachrichten werden nicht an den Browser übertragen, bevor das bestehende Login erfolgreich war.
- Externe Bilder/HTML werden nicht dargestellt (kein Remote-Tracking).
- Im Browser sind keine Zugangsdaten hinterlegt; IMAP/SMTP ausschließlich serverseitig.
- Anhänge: Dateinamen sichtbar, Download bewusst noch nicht implementiert.

## Noch erforderlich
Bei Vercel -> Projekt seniorenheim-auetal -> Environment Variables:
- `AUETAL_MAIL_USER` = `marketing@seniorenheim-auetal.de`
- `AUETAL_MAIL_PASSWORD` = Passwort aus der Einmal-Nachricht von Polaris Media

Beide Werte als verschlüsselte Variablen für die Freigabe-Branch anlegen. Nicht in GitHub oder im Chat veröffentlichen.
Danach Preview erneut bereitstellen und testen:
1. Anmelden an `/admin.html`.
2. `/postfach.html` öffnen.
3. Posteingang laden, Testmail empfangen, eine Testmail senden.
4. SMTP-Zustellung, SPF/DKIM/DMARC separat prüfen.

Mailserver (von Polaris): mail.polarismedia.de; IMAP SSL 993; SMTP SSL 465.

**Wichtig:** Der Maildienst ist ohne Variablen noch nicht aktiv. Die Freigabe-Branch ist eine Preview, nicht Production. Keine automatische Bewerber-Mailzuordnung oder Benachrichtigungen behaupten.
