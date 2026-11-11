# Auetal Recruiting – Aktivierung des echten Dashboards

## Bereits auf der Freigabe-Branch implementiert
- Karriere-Job-Match: vier Fragen, danach Name + Telefon/E-Mail, Nachricht, Datenschutz-Hinweis.
- Server-API POST /api/bewerbung: validiert Eingaben, begrenzt Missbrauch, speichert nur nach Aktivierung.
- Admin: Login mit httpOnly / Secure / SameSite=Strict Session-Cookie; keine öffentlichen Bewerberdaten.
- Dashboard: neue Bewerbungen (maximal 30 Sekunden bis zur nächsten Aktualisierung), Status, Notizen, Wiedervorlage, Löschung.
- UTM-Quelle/Kampagne wird mit erfolgreichem Kontakt gespeichert.
- Keine Demo-Bewerber oder erfundenen Werbe-KPIs mehr. Keine unkonfigurierten Datenabflüsse.

## 1. Separate kostenlose Neon-Datenbank
In https://console.neon.tech oder über die Vercel-Integration ein eigenes Projekt **Auetal Recruiting** in Frankfurt (EU Central) erstellen.
**Nicht** die bereits existierende DG-Outbound-Datenbank benutzen.
Bei Neons durch Vercel verwalteter Organisation ist die Projekterstellung aus der ChatGPT-Integration gesperrt. Daher diesen Schritt direkt im Anbieter-Dashboard ausführen.
In Neons SQL Editor die Datei `sql/auetal-recruiting.sql` ausführen. Dadurch entstehen die Bewerbertabelle, Status-Ereignisse und Missbrauchsschutz-Zähler.
Zugangsdaten nicht in GitHub committen oder in Chat-Nachrichten versenden.

## 2. Geheime Vercel-Umgebungsvariablen
Vercel-Projekt: `seniorenheim-auetal` → Settings → Environment Variables.
Alle Secrets als **Encrypted** oder **Sensitive** hinzufügen. Preview und Production getrennt konfigurieren.

| Name | Wert |
|---|---|
| `AUETAL_DATABASE_URL` | Separate PostgreSQL/Neon-Verbindung von Auetal, niemals DG Outbound |
| `AUETAL_SESSION_SECRET` | 64 Hex-Zeichen aus dem Generator |
| `AUETAL_ADMIN_PASSWORD_HASH` | `salt:hash` aus dem Generator; **kein Klartext-Passwort** |
| `AUETAL_ACCEPT_APPLICATIONS` | `false` bis alle Tests & Datenschutzfreigaben abgeschlossen sind; danach `true` |

Einmal lokal `node scripts/generate-auetal-secrets.js` ausführen. Der Generator erzeugt ein starkes Passwort, den Hash und das Session-Secret. Das Passwort im eigenen Passwortmanager sichern. **Niemals in GitHub, Screenshots oder die Website schreiben.**

Nach der Konfiguration die geschützte Preview neu deployen. Die API `/api/bewerbung` muss vor der Aktivierung `{"ready":false}` melden.

## 3. Datenschutz, Kundenfreigabe und Test
- Mit Herr Denecke Verantwortung für Bewerberdaten, Verarbeitungsverzeichnis, Auftragsverarbeitungsvertrag (Neon/Vercel), Datenschutzhinweise und Löschfristen abstimmen.
- Fachkraft-Angaben und Mitarbeiterfotos/-zitate vor öffentlichem Livegang freigeben.
- Eine synthetische Testbewerbung über den geschützten Funnel absenden. Das Dashboard muss sie zeigen.
- Status auf „Kontakt“ ändern, Notiz und Rückruf speichern, Aktualisierung prüfen, Testdatensatz anschließend endgültig löschen.
- Nach erfolgreichem Test `AUETAL_ACCEPT_APPLICATIONS=true` in der autorisierten Umgebung setzen und erneut deployen.
- Keine realen Bewerberdaten in Testdatenbanken oder fremden CRM-Systemen verwenden.

## 4. Bestehende Grenzen
- Bis zur DB- und Secret-Konfiguration ist der direkte Bewerbungsversand **absichtlich deaktiviert**.
- Das Dashboard kann keine Meta-/Google-Impressions oder Besucherzahlen zeigen, solange keine passende separate Datenintegration eingerichtet wurde.
- Echtzeit bedeutet hier bis zu ca. 30 Sekunden Verzögerung bei sichtbarem Dashboard (Polling), keine WebSocket-Verbindung.
- Es gibt noch keine Mitarbeiter-Benachrichtigung per E-Mail, SMS, Telegram oder WhatsApp. Diese Schritte müssen gesondert konfiguriert und freigegeben werden.
- Das Dashboard unterstützt aktuell **einen** gemeinsamen, geschützten Administrationszugang. Für mehrere Nutzer mit individuellen Rechten braucht es ein erweitertes Rollen-/Rechtesystem.
- Retentions-/Löschfristen müssen vor Produktivbetrieb festgelegt werden. Das Dashboard bietet manuelles, endgültiges Löschen; keine automatische Retention ist eingeschaltet.
