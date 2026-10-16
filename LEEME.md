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
