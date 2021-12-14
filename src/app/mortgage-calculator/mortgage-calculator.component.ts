import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { CalculatorInputsInterface } from './calculator-inputs/calculator-inputs.interface';

@Component({
    selector: 'app-mortgage-calculator',
    templateUrl: './mortgage-calculator.component.html',
    styleUrls: ['./mortgage-calculator.component.scss'],
})
export class MortgageCalculatorComponent implements OnInit {
    @Input() title: string = '';

    calculatorInputs!: CalculatorInputsInterface;

    constructor() {}

    ngOnInit(): void {}

    inputsSubmitted($event: CalculatorInputsInterface) {
        this.calculatorInputs = _.cloneDeep($event);
    }
}
