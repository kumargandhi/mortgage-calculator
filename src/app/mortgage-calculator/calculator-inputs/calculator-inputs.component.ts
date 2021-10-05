import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnInit,
    Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DestroyService } from '../../service/destroy.service';
import { takeUntil } from 'rxjs/operators';
import { INTEGER_REGEXP, FLOATING_REGEXP } from '../../constants';
import { CalculatorInputsInterface } from './calculator-inputs.interface';

@Component({
    selector: 'app-calculator-inputs',
    templateUrl: './calculator-inputs.component.html',
    styleUrls: ['./calculator-inputs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DestroyService],
})
export class CalculatorInputsComponent implements OnInit {
    @Output() inputsSubmitted = new EventEmitter<CalculatorInputsInterface>();

    form: FormGroup;

    isFormSubmitted = false;

    constructor(
        private _fb: FormBuilder,
        private _destroy$: DestroyService,
        private _cd: ChangeDetectorRef
    ) {
        this.form = this._fb.group({
            loanAmount: [
                800000,
                Validators.compose([
                    Validators.required,
                    Validators.pattern(INTEGER_REGEXP),
                ]),
            ],
            interestRate: [
                5.5,
                Validators.compose([
                    Validators.required,
                    Validators.pattern(FLOATING_REGEXP),
                ]),
            ],
            loanTerm: [
                7,
                Validators.compose([
                    Validators.required,
                    Validators.pattern(INTEGER_REGEXP),
                ]),
            ],
        });
        this.form.valueChanges
            .pipe(takeUntil(this._destroy$))
            .subscribe((data) => {
                this.onValueChanged(data);
            });
    }

    ngOnInit(): void {
        this.validateForm();
    }

    validateForm() {
        this.isFormSubmitted = true;
        if (this.form.valid) {
            const { loanAmount, interestRate, loanTerm } = this.form.controls;
            this.inputsSubmitted.emit({
                loanAmount: loanAmount.value,
                interestRate: interestRate.value,
                loanTerm: loanTerm.value,
            });
        }
    }

    onValueChanged(data?: any) {
        if (!data) {
            return;
        }
        // Do something!
    }
}
