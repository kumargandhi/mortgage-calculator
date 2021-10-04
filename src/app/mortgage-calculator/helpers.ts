import * as _ from 'lodash';
import { MonthlyPayment } from './calculator-results/calculator-results.interface';

/**
 * Format given number to two decimal values
 * @param n
 */
export function formatMoney(n: number) {
    // .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    return _.toNumber(n.toFixed(2));
}

/**
 * Calculate monthly payment of the loan
 * @param loanAmount
 * @param interest
 * @param period
 */
export function getMonthlyPayment(
    loanAmount: number,
    interest: number,
    period: number
) {
    let monthlyPayment = 0;

    monthlyPayment =
        loanAmount *
        ((interest * Math.pow(1 + interest, period)) /
            (Math.pow(1 + interest, period) - 1));
    monthlyPayment = Math.round(monthlyPayment * 100) / 100;

    return monthlyPayment;
}

/**
 * Calculate monthly data
 * @param loanAmount
 * @param interest
 * @param monthlyPay
 * @param month
 * @param totalInterest
 */
export function getBalance(
    loanAmount: number,
    interest: number,
    monthlyPay: number,
    month: number,
    totalInterest: number
): MonthlyPayment {
    let result = 0;
    let amountToPay = loanAmount * interest;
    amountToPay = Math.round(amountToPay * 100) / 100;
    result = loanAmount - monthlyPay;

    let totalInterestPaid = totalInterest + amountToPay;
    if (result > 0) {
        result = result + amountToPay;
    } else {
        monthlyPay = loanAmount + amountToPay;
        result = 0;
    }
    return {
        totalInterest: totalInterestPaid,
        balance: Math.round(result * 100) / 100,
        monthlyResult: {
            month: month,
            interest: formatMoney(amountToPay),
            principal: formatMoney(monthlyPay - amountToPay),
            balance: formatMoney(result),
        },
    };
}
