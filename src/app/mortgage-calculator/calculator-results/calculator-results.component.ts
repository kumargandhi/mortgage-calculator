import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
} from '@angular/core';
import * as _ from 'lodash';
import { CellConfig, jsPDF } from 'jspdf';
import { CalculatorInputsInterface } from '../calculator-inputs/calculator-inputs.interface';
import { formatMoney, getBalance, getMonthlyPayment } from '../helpers';
import { MonthlyPayment } from './calculator-results.interface';
import {NumberFormatterPipe} from "../../service/number-formatter.pipe";

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

    readonly nf = new NumberFormatterPipe();

    @Input() title: string = '';

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

    exportToPDF() {
        // Creating a unique file name for my PDF
        const fileName =
            this.title.replace(' ', '_') +
            '_' +
            Math.floor(Math.random() * 1000000 + 1) +
            '.pdf';
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        const titleXPos =
            doc.internal.pageSize.getWidth() / 2 -
            doc.getTextWidth(this.title) / 2;
        doc.text(this.title, titleXPos, 20);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(14);
        doc.text(this._getLoanDetails(), 10, 30);
        doc.table(
            10,
            95,
            this._getPaymentInformation(),
            this._createHeadersForPdfTable([
                'Month',
                'Interest',
                'Principal',
                'Balance',
            ]),
            { autoSize: false }
        );
        doc.save(fileName);
    }

    private _getLoanDetails() {
        let loanDetails = '';
        loanDetails =
            'Loan details:' +
            '\n\n' +
            'Loan amount: ' +
            this.nf.transform(this._calculatorInputs.loanAmount);
        loanDetails =
            loanDetails +
            '\n' +
            'Yearly interest rate (%): ' +
            this.nf.transform(this._calculatorInputs.interestRate);
        loanDetails =
            loanDetails +
            '\n' +
            'Loan term (Years): ' +
            this.nf.transform(this._calculatorInputs.loanTerm);
        loanDetails = loanDetails + '\n\n' + 'Repayment summary:';
        loanDetails =
            loanDetails +
            '\n\n' +
            this.nf.transform(this.computedValues.monthlyPayment) +
            ' - is your Monthly Payment.';
        loanDetails =
            loanDetails +
            '\n' +
            this.nf.transform(this.totalInterestPaid) +
            ' - is Total Interest Paid.';
        loanDetails = loanDetails + '\n\n' + 'Payment information:';
        return loanDetails;
    }

    private _createHeadersForPdfTable(keys: string[]) {
        const result: CellConfig[] = [];
        for (let i = 0; i < keys.length; i += 1) {
            result.push({
                name: keys[i],
                prompt: keys[i],
                width: 55,
                align: 'center',
                padding: 10,
            });
        }
        return result;
    }

    private _getPaymentInformation(): any {
        const tableData = [];
        for (let i = 0; i < this.monthlyPayments.length; i++) {
            tableData.push({
                Month: this.nf.transform(this.monthlyPayments[i].monthlyResult.month),
                Interest: this.nf.transform(this.monthlyPayments[i].monthlyResult.interest),
                Principal: this.nf.transform(this.monthlyPayments[i].monthlyResult.principal),
                Balance: this.nf.transform(this.monthlyPayments[i].monthlyResult.balance),
            });
        }
        return tableData;
    }
}
