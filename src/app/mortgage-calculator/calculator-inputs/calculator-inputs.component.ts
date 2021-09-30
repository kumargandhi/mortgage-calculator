import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DestroyService } from '../../service/destroy.service';
import { takeUntil } from 'rxjs/operators';
import { INTEGER_REGEXP } from '../../constants';

@Component({
    selector: 'app-calculator-inputs',
    templateUrl: './calculator-inputs.component.html',
    styleUrls: ['./calculator-inputs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DestroyService],
})
export class CalculatorInputsComponent implements OnInit {
    form: FormGroup;

    isFormSubmitted = false;

    constructor(
        private _fb: FormBuilder,
        private _destroy$: DestroyService,
        private _cd: ChangeDetectorRef
    ) {
        this.form = this._fb.group({
            loanAmount: [
                null,
                Validators.compose([
                    Validators.required,
                    Validators.pattern(INTEGER_REGEXP),
                ]),
            ],
            interestRate: [
                null,
                Validators.compose([
                    Validators.required,
                    Validators.pattern(INTEGER_REGEXP),
                ]),
            ],
            loanTerm: [
                null,
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

    ngOnInit(): void {}

    validateForm() {
        this.isFormSubmitted = true;
    }

    onValueChanged(data?: any) {
        if (!data) {
            return;
        }
        // Do something
    }
}
