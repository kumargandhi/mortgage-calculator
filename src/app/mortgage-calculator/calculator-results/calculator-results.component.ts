import { Component, Input, OnInit } from '@angular/core';
import { CalculatorInputsInterface } from '../calculator-inputs/calculator-inputs.interface';

@Component({
    selector: 'app-calculator-results',
    templateUrl: './calculator-results.component.html',
    styleUrls: ['./calculator-results.component.scss'],
})
export class CalculatorResultsComponent implements OnInit {
    _calculatorInputs: CalculatorInputsInterface =
        new CalculatorInputsInterface();

    computedValues: CalculatorInputsInterface = new CalculatorInputsInterface();

    constructor() {}

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
        this.computedValues = {
            loanAmount: this._calculatorInputs.loanAmount,
            interestRate: this._calculatorInputs.interestRate / 100 / 12,
            loanTerm: this._calculatorInputs.loanTerm * 12,
        };
        this.computedValues.monthlyPayment = this.getMonthlyPayment(
            this.computedValues.loanAmount,
            this.computedValues.interestRate,
            this.computedValues.loanTerm
        );
    }

    /**
     * Calculate monthly payment of the loan
     * @param loanAmount
     * @param interest
     * @param period
     */
    getMonthlyPayment(loanAmount: number, interest: number, period: number) {
        let monthlyPayment = 0;

        monthlyPayment =
            loanAmount *
            ((interest * Math.pow(1 + interest, period)) /
                (Math.pow(1 + interest, period) - 1));
        monthlyPayment = Math.round(monthlyPayment * 100) / 100;

        return monthlyPayment;
    }
}
