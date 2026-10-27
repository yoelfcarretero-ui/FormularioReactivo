# FormularioReactivo - archivos de la actividad

## Cómo usarlo
Este ZIP es el proyecto completo (sin node_modules).
1. Descomprime la carpeta FormularioReactivo y ábrela en la terminal.
2. npm install
3. ionic serve   (o npm start) para probar las validaciones
4. Sube a GitHub y despliega en Vercel:
   - Build command: npm run build
   - Output directory: www
   - vercel.json ya incluido para que no falle al recargar

## Explicación para exponer a la profesora
Para el formulario he usado Reactive Forms: toda la lógica está en TypeScript con un FormGroup creado con FormBuilder, y en la plantilla solo enlazo cada campo con formControlName. Elegí este enfoque porque es más escalable y más fácil de testear que el basado en plantilla.

He creado dos validadores personalizados. skuValidator comprueba con una expresión regular que el código tenga exactamente 12 caracteres alfanuméricos, y fechaNoFuturaValidator impide que la fecha de nacimiento sea posterior a hoy. El stock lo valido con Validators.min(1) para que sea mayor que 0.

Para los mensajes de error uso la propiedad errorText de los componentes de Ionic. Como un mismo campo puede fallar por motivos distintos, he creado getters que devuelven el mensaje según el error activo.

En el envío uso un Signal booleano, isSubmitting, para gestionar el estado de carga. Mientras vale true, deshabilito el formulario con disable() y muestro el ion-spinner en el botón. Al terminar la simulación de 2 segundos, reseteo el formulario y abro un ion-toast que confirma el guardado.

Para móvil, en el stock uso inputmode="numeric" para que aparezca el teclado numérico nativo, y para la categoría un ion-select con tres opciones.

El campo añadido es la fecha de nacimiento, con type="date" para que el móvil muestre su selector nativo. Es obligatoria y tiene su propio validador para evitar fechas futuras.

## Ampliación de la actividad

**Cambio de nombre de Home a RegistroPage.** He renombrado la carpeta `home` a `registro`, igual que sus cuatro ficheros (`registro.page.ts/html/scss/spec.ts`), la clase `HomePage` (ahora `RegistroPage`) y el selector `app-home` (ahora `app-registro`). En `app.routes.ts` la ruta es ahora `registro`, y tanto la ruta vacía como las rutas desconocidas redirigen a ella.

**Fecha de nacimiento.** El validador `fechaNoFuturaValidator` compara la fecha como texto `YYYY-MM-DD` con la de hoy en hora local. Así se evita el desfase de zona horaria que da `new Date('2026-10-27')`, que se interpreta en UTC. Además, el atributo `max` impide elegir días futuros en el calendario.

**Notificación de envío.** Al terminar el guardado simulado aparece un `ion-toast` verde con el texto "Formulario enviado correctamente".

**Contraseña cifrada.** Antes del `console.log` la contraseña se pasa por SHA-256 con la Web Crypto API (`crypto.subtle.digest`), así que en la consola solo aparece el hash y nunca el texto plano. Es un cifrado de un solo sentido: no se puede recuperar la contraseña original.

**Modo oscuro.** Lo gestiona `ThemeService` con un Signal. Al cambiarlo añade o quita la clase `ion-palette-dark` en `<html>` (por eso en `global.scss` se importa `dark.class.css`) y guarda la preferencia en `localStorage`.

**PDF.** Después de enviar aparece el botón "Descargar PDF". El PDF se genera con jsPDF, que se carga bajo demanda con `import()`, con los datos del último envío y la contraseña ya cifrada.

**Diseño responsive (RWD).** Los componentes de Ionic ya se adaptan al móvil. En escritorio el formulario se centra con un ancho máximo de 640px. Lo he comprobado en DevTools con la vista de móvil.

**Página driven (template-driven).** Tiene los mismos campos y validaciones, pero declarados en el HTML: `[(ngModel)]`, `required` y `pattern`, más directivas propias (`appSku`, `appFechaNoFutura` y `appMin`) que reutilizan las mismas funciones de validación del formulario reactivo. Hacen falta directivas porque el validador `min` de Angular solo funciona sobre `<input type="number">` y no sobre `<ion-input>`.

### Comparación de los dos modelos
| | Reactivo (`/registro`) | Template-driven (`/driven`) |
|---|---|---|
| Dónde está la lógica | En TypeScript (`FormGroup`) | En el HTML (`ngModel`) |
| Validadores | Funciones en `fb.group()` | Atributos y directivas en la plantilla |
| Acceso a los datos | `form.getRawValue()` | Objeto `producto` enlazado |
| Deshabilitar el formulario | `form.disable()` | `[disabled]` en cada campo |
| Testing | Sencillo, sin DOM | Requiere renderizar la plantilla |
| Escalabilidad | Alta | Baja, mejor para formularios pequeños |
