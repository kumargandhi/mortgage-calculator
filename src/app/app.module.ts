import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MortgageCalculatorComponent } from './mortgage-calculator/mortgage-calculator.component';
import { CalculatorInputsComponent } from './mortgage-calculator/calculator-inputs/calculator-inputs.component';
import { CalculatorResultsComponent } from './mortgage-calculator/calculator-results/calculator-results.component';
import { NumberFormatterPipe } from './service/number-formatter.pipe';

@NgModule({
    declarations: [
        AppComponent,
        NumberFormatterPipe,
        MortgageCalculatorComponent,
        CalculatorInputsComponent,
        CalculatorResultsComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
