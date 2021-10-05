import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
} from '@angular/core';
import * as _ from 'lodash';
import { CalculatorInputsInterface } from '../calculator-inputs/calculator-inputs.interface';
import { formatMoney, getBalance, getMonthlyPayment } from '../helpers';
import { MonthlyPayment } from './calculator-results.interface';

@Component({
    selector: 'app-calculator-results',
    templateUrl: './calculator-results.component.html',
    styleUrls: ['./calculator-results.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculatorResultsComponent implements OnInit {
    _calculatorInputs!: CalculatorInputsInterface;

    computedValues!: CalculatorInputsInterface;

    errorModel = {
        errorMsg: '',
    };

    monthlyPayments: MonthlyPayment[] = [];

    totalInterestPaid = 0;

    resultsCalculated = false;

    constructor(private _cd: ChangeDetectorRef) {}

    ngOnInit(): void {}

    @Input()
    set calculatorInputs(value: CalculatorInputsInterface) {
        if (value) {
            this._calculatorInputs = value;
            this.calculate();
        }
    }

    /**
     * Calculate monthly interest, total months of loan term, monthly payment.
     */
    calculate() {
        this.resultsCalculated = false;
        this.monthlyPayments = [];
        this.errorModel.errorMsg = '';
        this.computedValues = {
            loanAmount: this._calculatorInputs.loanAmount,
            interestRate: this._calculatorInputs.interestRate / 100 / 12,
            loanTerm: this._calculatorInputs.loanTerm * 12,
        };
        this.computedValues.monthlyPayment = getMonthlyPayment(
            this.computedValues.loanAmount,
            this.computedValues.interestRate,
            this.computedValues.loanTerm
        );
        let month = 0;
        let totalInterestPaid = 0;
        let loanAmount = this.computedValues.loanAmount;
        let balance = 0;
        do {
            month = month + 1;
            let monthlyPayment: MonthlyPayment = getBalance(
                loanAmount,
                this.computedValues.interestRate,
                this.computedValues.monthlyPayment,
                month,
                totalInterestPaid
            );
            balance = monthlyPayment.balance;
            this.monthlyPayments.push(monthlyPayment);
            totalInterestPaid = monthlyPayment.totalInterest;

            if (balance < loanAmount) {
                loanAmount = balance;
            } else {
                this.errorModel.errorMsg =
                    'With The Loan Term ' +
                    this._calculatorInputs.loanTerm +
                    ' Years and Interest Rate ' +
                    this._calculatorInputs.interestRate +
                    '%, its' +
                    ' not possible to pay off mortgage loan.';
            }
        } while (balance > 0);
        if (_.isEmpty(this.errorModel.errorMsg)) {
            this.totalInterestPaid = formatMoney(totalInterestPaid);
            this.computedValues.monthlyPayment = formatMoney(
                this.computedValues?.monthlyPayment
            );
        }
        this._cd.markForCheck();
        this.resultsCalculated = true;
    }
}
