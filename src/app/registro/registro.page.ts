import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput,
  IonSelect, IonSelectOption, IonButton, IonButtons, IonIcon, IonSpinner, IonToast,
  IonSegment, IonSegmentButton, IonLabel
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { downloadOutline, moon, sunny } from 'ionicons/icons';
import { PASSWORD_PATTERN, fechaNoFuturaValidator, hoyISO, skuValidator } from '../shared/validators';
import { cifrarPassword } from '../shared/crypto';
import { DatosProducto, descargarPdf } from '../shared/pdf';
import { ThemeService } from '../shared/theme.service';

@Component({
  selector: 'app-registro',
  templateUrl: 'registro.page.html',
  styleUrls: ['registro.page.scss'],
  imports: [
    ReactiveFormsModule, RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonList,
    IonItem, IonInput, IonSelect, IonSelectOption, IonButton, IonButtons, IonIcon,
    IonSpinner, IonToast, IonSegment, IonSegmentButton, IonLabel
  ],
})
export class RegistroPage {
  private fb = inject(FormBuilder);
  public theme = inject(ThemeService);

  public productoForm: FormGroup;
  public isSubmitting = signal<boolean>(false);
  public toastAbierto = signal<boolean>(false);
  // Últimos datos enviados (con la contraseña ya cifrada) para poder descargarlos en PDF
  public ultimoEnvio = signal<DatosProducto | null>(null);
  public categorias = ['Electrónica', 'Herramientas', 'Consumibles'];
  public hoy = hoyISO();

  constructor() {
    addIcons({ moon, sunny, downloadOutline });

    this.productoForm = this.fb.group({
      sku: ['', [Validators.required, skuValidator]],
      nombre: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      stockMinimo: [null, [Validators.required, Validators.min(1)]],
      fechaNacimiento: ['', [Validators.required, fechaNoFuturaValidator]],
      password: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]],
    });
  }

  get f() { return this.productoForm.controls; }

  get errorSku(): string {
    if (this.f['sku'].hasError('required')) return 'El SKU es obligatorio.';
    return 'Debe tener exactamente 12 caracteres alfanuméricos.';
  }
  get errorStock(): string {
    if (this.f['stockMinimo'].hasError('required')) return 'El stock mínimo es obligatorio.';
    return 'El valor debe ser mayor que 0.';
  }
  get errorFecha(): string {
    if (this.f['fechaNacimiento'].hasError('required')) return 'La fecha de nacimiento es obligatoria.';
    return 'La fecha no puede ser posterior a hoy.';
  }
  get errorPassword(): string {
    if (this.f['password'].hasError('required')) return 'La contraseña es obligatoria.';
    return 'Mínimo 8 caracteres, letras y números.';
  }

  async onSubmit(): Promise<void> {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.productoForm.disable();

    try {
      const valores = this.productoForm.getRawValue();
      // La contraseña se cifra antes de mostrarla en consola o guardarla
      const payload: DatosProducto = { ...valores, password: await cifrarPassword(valores.password) };
      console.log('Payload:', payload);

      await new Promise(resolve => setTimeout(resolve, 2000)); // simula el guardado

      this.ultimoEnvio.set(payload);
      this.productoForm.reset();
      this.toastAbierto.set(true);
    } catch (error) {
      console.error('Error al guardar los datos', error);
    } finally {
      this.productoForm.enable();
      this.isSubmitting.set(false);
    }
  }

  async descargarPdf(): Promise<void> {
    const datos = this.ultimoEnvio();
    if (datos) await descargarPdf(datos, 'Reactivo (RegistroPage)');
  }
}
