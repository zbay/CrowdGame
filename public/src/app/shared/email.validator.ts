import { Directive, forwardRef } from "@angular/core";
import { NG_VALIDATORS, Validator, AbstractControl, FormControl } from "@angular/forms";

function validateEmailFactory() {
    return (c: FormControl) => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return (emailRegex.test(c.value)) ? null : {
        validEmail: {
          valid: false
        }
      };
    };
  }

@Directive({
    selector: '[validEmail][ngModel], [validEmail][FormControl]',
    providers: [{provide: NG_VALIDATORS, useExisting: forwardRef(() => ValidEmailDirective), multi: true}]
  })
  export class ValidEmailDirective implements Validator {
   
    validator: Function;

    constructor() {
        this.validator = validateEmailFactory();
    }

    validate(c: FormControl) {
        return this.validator(c);
    }
  }