import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput,
  IonSelect, IonSelectOption, IonButton, IonButtons, IonIcon, IonSpinner, IonToast,
  IonSegment, IonSegmentButton, IonLabel
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { downloadOutline, moon, sunny } from 'ionicons/icons';
import { FechaNoFuturaDirective, MinValorDirective, SkuValidatorDirective } from '../shared/validator.directives';
import { hoyISO } from '../shared/validators';
import { cifrarPassword } from '../shared/crypto';
import { DatosProducto, descargarPdf } from '../shared/pdf';
import { ThemeService } from '../shared/theme.service';

// Formulario template-driven: los datos viven en un objeto del componente enlazado con
// [(ngModel)] y las validaciones se declaran en el HTML (required, pattern y directivas propias).
@Component({
  selector: 'app-driven',
  templateUrl: 'driven.page.html',
  styleUrls: ['driven.page.scss'],
  imports: [
    FormsModule, RouterLink, SkuValidatorDirective, FechaNoFuturaDirective, MinValorDirective,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonSelect,
    IonSelectOption, IonButton, IonButtons, IonIcon, IonSpinner, IonToast,
    IonSegment, IonSegmentButton, IonLabel
  ],
})
export class DrivenPage {
  public theme = inject(ThemeService);

  public producto = this.productoVacio();
  public isSubmitting = signal<boolean>(false);
  public toastAbierto = signal<boolean>(false);
  public ultimoEnvio = signal<DatosProducto | null>(null);
  public categorias = ['Electrónica', 'Herramientas', 'Consumibles'];
  public hoy = hoyISO();
  public passwordPattern = '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$';

  constructor() {
    addIcons({ moon, sunny, downloadOutline });
  }

  async onSubmit(form: NgForm): Promise<void> {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const payload: DatosProducto = {
        ...this.producto,
        stockMinimo: Number(this.producto.stockMinimo),
        password: await cifrarPassword(this.producto.password),
      };
      console.log('Payload (template-driven):', payload);

      await new Promise(resolve => setTimeout(resolve, 2000)); // simula el guardado

      this.ultimoEnvio.set(payload);
      form.resetForm();
      this.producto = this.productoVacio();
      this.toastAbierto.set(true);
    } catch (error) {
      console.error('Error al guardar los datos', error);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async descargarPdf(): Promise<void> {
    const datos = this.ultimoEnvio();
    if (datos) await descargarPdf(datos, 'Template-driven (DrivenPage)');
  }

  private productoVacio() {
    return { sku: '', nombre: '', categoria: '', stockMinimo: null as number | null, fechaNacimiento: '', password: '' };
  }
}
