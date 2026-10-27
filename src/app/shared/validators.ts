import { AbstractControl, ValidationErrors } from '@angular/forms';

// Fecha de hoy en formato YYYY-MM-DD (hora local), el mismo que devuelve un input type="date"
export function hoyISO(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

// Validador personalizado: SKU de exactamente 12 caracteres alfanuméricos
export function skuValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  if (!valor) return null; // "required" ya se encarga del vacío
  return /^[A-Za-z0-9]{12}$/.test(valor) ? null : { skuInvalido: true };
}

// Validador personalizado: la fecha de nacimiento no puede ser posterior a hoy.
// Se comparan cadenas YYYY-MM-DD para evitar problemas de zona horaria con new Date().
export function fechaNoFuturaValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  return String(control.value) > hoyISO() ? { fechaFutura: true } : null;
}

// Patrón de la contraseña (del dossier): mínimo 8 caracteres, al menos una letra y un número
export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
