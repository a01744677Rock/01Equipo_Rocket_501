# Equipo Rocket · Aerospace Technology — Landing Page

Landing page estática lista para GitHub Pages.

## Estructura
```
index.html            ← página principal
css/styles.css        ← estilos (colores de la identidad en :root)
js/main.js            ← estrellas, cuenta regresiva, secuencia de lanzamiento, tarjetas 3D, música y menú móvil
assets/img/
  logo-principal.png  ← logo principal (hero, identidad, pie)
  logo-horizontal.png ← logo horizontal (encabezado)
  despegue.svg        ← fondo: cohete despegando (estático)
  kit-identidad.jpg   ← cartel con todas las versiones del logo
  isotipo.png, favicon-32.png, favicon-64.png, apple-touch-icon.png
.nojekyll
```

## Publicar en GitHub Pages
1. Crea un repositorio nuevo (por ejemplo `landingpage_TUMATRICULA`).
2. Sube **el contenido** de esta carpeta (que `index.html` quede en la raíz del repo).
3. Ve a **Settings → Pages** → *Source:* `Deploy from a branch` → Branch `main` / `(root)` → **Save**.
4. En 1–2 minutos tu página estará en `https://TUUSUARIO.github.io/NOMBRE-DEL-REPO/`.

## Personalizar
- **Fecha del lanzamiento:** `js/main.js`, constante `FECHA_LANZAMIENTO`.
- **Tripulación:** en `index.html`, sección `id="equipo"` (nombres, iniciales y roles de cada gafete).
- **Fase actual:** cambia las clases `done` / `current` en el stepper del hero y en la sección `id="fases"`.
