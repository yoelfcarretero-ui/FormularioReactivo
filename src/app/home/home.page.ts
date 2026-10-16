import { Component, signal } from '@angular/core';
import {
  AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule,
  ValidationErrors, Validators
} from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
  IonInput, IonSelect, IonSelectOption, IonButton, IonSpinner, IonToast
} from '@ionic/angular';

// Validador personalizado: SKU de exactamente 12 caracteres alfanuméricos
export function skuValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  if (!valor) return null; // "required" ya se encarga del vacío
  return /^[A-Za-z0-9]{12}$/.test(valor) ? null : { skuInvalido: true };
}

// Validador personalizado: la fecha de nacimiento no puede ser futura
export function fechaNoFuturaValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  return new Date(control.value) > new Date() ? { fechaFutura: true } : null;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList,
    IonItem, IonInput, IonSelect, IonSelectOption, IonButton, IonSpinner, IonToast
  ],
})
export class HomePage {
  public productoForm: FormGroup;
  public isSubmitting = signal<boolean>(false);
  public toastAbierto = signal<boolean>(false);
  public categorias = ['Electrónica', 'Herramientas', 'Consumibles'];

  constructor(private fb: FormBuilder) {
    this.productoForm = this.fb.group({
      sku: ['', [Validators.required, skuValidator]],
      nombre: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      stockMinimo: [null, [Validators.required, Validators.min(1)]],
      fechaNacimiento: ['', [Validators.required, fechaNoFuturaValidator]],
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
    return 'La fecha no puede ser futura.';
  }

  async onSubmit(): Promise<void> {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.productoForm.disable();

    try {
      console.log('Payload:', this.productoForm.getRawValue());
      await new Promise(resolve => setTimeout(resolve, 2000)); // simula el guardado
      this.productoForm.enable();
      this.productoForm.reset();
      this.toastAbierto.set(true);
    } finally {
      this.productoForm.enable();
      this.isSubmitting.set(false);
    }
  }
}
