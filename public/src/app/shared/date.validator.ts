import { Directive, forwardRef } from "@angular/core";
import { NG_VALIDATORS, Validator, AbstractControl, FormControl } from "@angular/forms";
import * as moment from "moment";

function validateDateFactory() {
    return (c: FormControl) => {
        let dateRegex = /^[0-9]{4}-[0-9][0-9]?-[0-9][0-9]?$/;
        let yearStr, monthInt, dayStr;
        let roughlyValidDate = dateRegex.test(c.value);
        if(roughlyValidDate){
            yearStr = c.value.slice(0, 4);
            let cvalue = c.value.slice(5);
            let secondDashIndex = cvalue.indexOf("-");
            monthInt = parseInt(cvalue.slice(0, secondDashIndex))-1;
            dayStr = cvalue.slice(secondDashIndex+1);
        }
        return ( roughlyValidDate
            && moment([yearStr, monthInt, dayStr]).isValid()
            && (moment([yearStr, monthInt, dayStr]).valueOf() > moment().valueOf())
            // ascertain date string is of proper length, valid, and in the future
        ) ? null : {
        validDate: {
          valid: false
        }
      };
    };
  }

@Directive({
    selector: '[validDate][ngModel], [validDate][FormControl]',
    providers: [{provide: NG_VALIDATORS, useExisting: forwardRef(() => ValidDateDirective), multi: true}]
  })
  export class ValidDateDirective implements Validator {
   
    validator: Function;

    constructor() {
        this.validator = validateDateFactory();
    }

    validate(c: FormControl) {
        return this.validator(c);
    }
  }