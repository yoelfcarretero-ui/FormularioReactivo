import { Directive, input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, Validators } from '@angular/forms';
import { fechaNoFuturaValidator, skuValidator } from './validators';

// En los formularios template-driven los validadores se aplican como directivas en el HTML.
// Estas directivas reutilizan las mismas funciones que el formulario reactivo.

@Directive({
  selector: '[appSku][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: SkuValidatorDirective, multi: true }],
})
export class SkuValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return skuValidator(control);
  }
}

@Directive({
  selector: '[appFechaNoFutura][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: FechaNoFuturaDirective, multi: true }],
})
export class FechaNoFuturaDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return fechaNoFuturaValidator(control);
  }
}

// El validador "min" de Angular solo funciona sobre <input type="number">, no sobre <ion-input>
@Directive({
  selector: '[appMin][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MinValorDirective, multi: true }],
})
export class MinValorDirective implements Validator {
  public appMin = input.required<number>();

  validate(control: AbstractControl): ValidationErrors | null {
    return Validators.min(this.appMin())(control);
  }
}
