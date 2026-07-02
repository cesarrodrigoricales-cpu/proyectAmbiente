# 🌿 Proyecto Ambiental UAI × Chinchaysuyo 2026

Página web de presentación del proyecto de proyección social de la Universidad Autónoma de Ica.

---

## 📁 Estructura de archivos

```
proyecto-ambiental/
├── index.html          ← Página principal
├── style.css           ← Estilos
├── script.js           ← Interactividad
├── README.md           ← Este archivo
└── images/
    ├── hero-bg.jpg         ← Imagen de fondo del HERO (recomendado: 1920×1080px)
    ├── about-main.jpg      ← Imagen principal sección "Sobre el Proyecto"
    ├── about-accent.jpg    ← Imagen pequeña superpuesta en "Sobre el Proyecto"
    ├── video-poster.jpg    ← Miniatura del video (se muestra si el video carga lento)
    ├── act-juegos.jpg      ← Actividad: Juegos dinámicos
    ├── act-concurso.jpg    ← Actividad: Concurso ecológico
    ├── act-jardines.jpg    ← Actividad: Áreas verdes
    ├── act-reciclaje.jpg   ← Actividad: Reciclaje
    ├── act-complementarias.jpg ← Actividad: Complementarias
    ├── gallery/
    │   ├── g1.jpg  ... g10.jpg   ← Fotos de la galería (10 imágenes)
    └── team/
        ├── t1.jpg  ... t4.jpg    ← Fotos del equipo (4 personas)

└── videos/
    └── ambiente.mp4    ← Video de fondo de la sección video (opcional)
```

---

## 🖼️ Cómo agregar tus imágenes

Simplemente **copia tus imágenes** con los nombres exactos indicados arriba.

- **Hero background** (`hero-bg.jpg`): Imagen de bosque, naturaleza, o paisaje verde. Mínimo 1920px de ancho.
- **Galería** (`g1.jpg` a `g10.jpg`): Fotos de actividades, naturaleza, equipo. Pueden ser horizontales o verticales.
- **Equipo** (`t1.jpg` a `t4.jpg`): Fotos tipo retrato (verticales) de los integrantes.

> Si no tienes alguna imagen, no hay problema — el sitio muestra un placeholder con instrucciones.

---

## 🎥 Cómo agregar video

### Opción A — Video propio (MP4)
Copia tu video como `videos/ambiente.mp4`.

### Opción B — Video de YouTube
En `index.html`, busca la sección del video (línea ~190) y:
1. Comenta el tag `<video>` (agrega `<!--` y `-->`)
2. Descomenta el bloque `<div class="yt-wrapper">...`
3. Reemplaza `VIDEO_ID` con el ID de tu video de YouTube

---

## 📅 Configurar la fecha del contador

En `script.js`, línea 9:
```js
const TARGET_DATE = new Date('2026-09-01T08:00:00');
```
Cambia `2026-09-01` por la fecha real del evento.

---

## ✏️ Personalizar texto y datos

En `index.html` busca y reemplaza:
- `Nombre del Docente` / `Nombre del Estudiante` → nombres reales del equipo
- `correo@universidad.edu.pe` → correo real
- `+51 XXX XXX XXX` → teléfono real

---

## 🌐 Cómo abrir el sitio

Simplemente abre `index.html` en cualquier navegador moderno.

Para un servidor local (recomendado para el video):
```bash
# Con Python
python -m http.server 8000

# Con Node.js
npx serve .
```
Luego abre: `http://localhost:8000`

---

## 🎨 Colores del proyecto

| Color | Hex | Uso |
|-------|-----|-----|
| Verde profundo | `#1a3a2a` | Fondo oscuro, títulos |
| Verde salvia | `#4a7c59` | Acentos, tags |
| Dorado tierra | `#c8a84b` | Botones, detalles |
| Verde pálido | `#e8ede9` | Fondos de sección |

---

Hecho con 💚 para la Universidad Autónoma de Ica · Ciclo 2026-I
