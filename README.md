# FormularioReactivo

Formulario reactivo en Ionic y Angular (Desarrollo de Interfaces, 2º DAM).

**Demo en Vercel:** https://TU-URL.vercel.app

## Páginas

| Ruta | Página | Tipo de formulario |
|------|--------|--------------------|
| `/registro` | `RegistroPage` | Reactive Forms (`FormGroup` + `FormBuilder`) |
| `/driven` | `DrivenPage` | Template-driven (`ngModel`) |

La ruta vacía (y cualquier ruta desconocida) redirige a `/registro`.

Campos: SKU, nombre, categoría, stock mínimo, fecha de nacimiento y contraseña.

## Funcionalidades

- Validaciones con mensajes `errorText` de Ionic.
- La fecha de nacimiento no puede ser posterior a hoy (validador propio + atributo `max`).
- Al enviar: spinner durante el guardado simulado y `ion-toast` de confirmación.
- La contraseña se cifra con SHA-256 antes de mostrarse en consola.
- Botón de modo oscuro (se recuerda la preferencia).
- Botón para descargar en PDF los datos del último envío (jsPDF).
- Diseño responsive: ancho completo en móvil y centrado (máx. 640px) en escritorio.

## Uso

```bash
npm install
npm start        # http://localhost:4200
npm run build    # genera la carpeta www (la que publica Vercel)
```
