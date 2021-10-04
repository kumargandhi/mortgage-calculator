export interface MonthlyPayment {
    totalInterest: number;
    balance: number;
    monthlyResult: MonthlyResult;
}

export interface MonthlyResult {
    month: number;
    interest: number;
    principal: number;
    balance: number;
}
