import { Injectable, effect, signal } from '@angular/core';

const CLAVE = 'modoOscuro';

// Gestiona el modo oscuro añadiendo la clase "ion-palette-dark" al <html>
// (requiere importar dark.class.css en global.scss)
@Injectable({ providedIn: 'root' })
export class ThemeService {
  public oscuro = signal<boolean>(this.preferenciaInicial());

  constructor() {
    effect(() => {
      const activo = this.oscuro();
      document.documentElement.classList.toggle('ion-palette-dark', activo);
      try { localStorage.setItem(CLAVE, String(activo)); } catch { /* sin almacenamiento */ }
    });
  }

  toggle(): void {
    this.oscuro.update(v => !v);
  }

  // Si el usuario ya eligió antes se respeta; si no, se usa la preferencia del sistema
  private preferenciaInicial(): boolean {
    try {
      const guardado = localStorage.getItem(CLAVE);
      if (guardado !== null) return guardado === 'true';
    } catch { /* sin almacenamiento */ }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }
}
