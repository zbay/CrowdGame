import { Directive, forwardRef } from "@angular/core";
import { NG_VALIDATORS, Validator, AbstractControl, FormControl } from "@angular/forms";

function validateTimeFactory() {
    return (c: FormControl) => {
        const timeRegex = /^(([0-1][0-9])|([2][0-3])){1}:([0-5][0-9]){1}$/;
        return (timeRegex.test(c.value)) ? null : {
        validTime: {
          valid: false
        }
      };
    };
  }

@Directive({
    selector: '[validTime][ngModel], [validTime][FormControl]',
    providers: [{provide: NG_VALIDATORS, useExisting: forwardRef(() => ValidTimeDirective), multi: true}]
  })
  export class ValidTimeDirective implements Validator {
   
    validator: Function;

    constructor() {
        this.validator = validateTimeFactory();
    }

    validate(c: FormControl) {
        return this.validator(c);
    }
  }