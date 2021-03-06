import { Directive, forwardRef } from "@angular/core";
import { NG_VALIDATORS, Validator, AbstractControl, FormControl } from "@angular/forms";

function validateUrlFactory() {
    return (c: FormControl) => {
        const urlRegex = /^(http(s?):)|([/|.|\w|\s])*\.(?:jpg|gif|png|jpeg)$/;
        return (urlRegex.test(c.value)) ? null : {
        validEmail: {
          valid: false
        }
      };
    };
  }

@Directive({
    selector: '[validUrl][ngModel], [validUrl][FormControl]',
    providers: [{provide: NG_VALIDATORS, useExisting: forwardRef(() => ValidUrlDirective), multi: true}]
  })
  export class ValidUrlDirective implements Validator {
   
    validator: Function;

    constructor() {
        this.validator = validateUrlFactory();
    }

    validate(c: FormControl) {
        return this.validator(c);
    }
  }