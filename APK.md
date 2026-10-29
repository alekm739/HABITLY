# Cómo convertir Habitly en APK

Hay dos caminos. Empieza por el A; pasa al B cuando quieras recordatorios a hora fija.

## A) PWABuilder (sin programar, 10 minutos)
1. Publica la carpeta en GitHub Pages o Netlify (ver LEEME.md). Debe abrir en https.
2. Entra a https://www.pwabuilder.com y pega el link de tu app.
3. Elige **Android → Generate Package**. Te da un .apk para instalar directo y un .aab para Google Play.
4. Guarda el archivo `signing.keystore` y sus contraseñas: los necesitas para futuras actualizaciones.

La APK abre tu web en pantalla completa (Trusted Web Activity). Cada cambio que subas a la web aparece solo en la app.

## B) Capacitor (APK "real" con notificaciones programadas)
Necesario para: recordatorios a hora fija aunque la app esté cerrada, widgets, vibración avanzada.

Prompt listo para darle a Kiro, Claude Code o cualquier asistente de código, junto con esta carpeta:

> Tengo una PWA en un solo archivo `index.html` (más `manifest.json`, `sw.js`, `icons/`).
> Guarda todo en localStorage con la clave `habitly.v2`.
> Quiero envolverla con **Capacitor 6** para Android:
> 1. Crea un proyecto con `npm init`, instala `@capacitor/core @capacitor/cli @capacitor/android` y configura `webDir: "www"` copiando ahí estos archivos. App id: `com.habitly.app`, nombre: Habitly.
> 2. Agrega `@capacitor/local-notifications` y `@capacitor/haptics`. Expón en `window` una función `scheduleReminder(id, title, body, hour, minute)` que programe un recordatorio diario, y úsala para:
>    - un recordatorio por cada bloque de Focus (hora de inicio de cada sección en `S.sections[].from`),
>    - un recordatorio a las 21:00 si quedan hábitos pendientes.
> 3. Reemplaza `navigator.vibrate` por Haptics cuando esté disponible.
> 4. Desactiva el registro del service worker dentro de Capacitor (`if (window.Capacitor) no registrar sw.js`).
> 5. Usa `icons/icon-512.png` para generar los íconos con `@capacitor/assets`.
> 6. Crea un workflow de **GitHub Actions** que compile un APK debug en cada push y lo deje como artefacto descargable.
> No cambies la lógica ni el diseño de la app.

Si no quieres instalar Android Studio, el paso 6 hace que GitHub compile la APK por ti.
