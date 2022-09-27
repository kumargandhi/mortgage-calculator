import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'nf',
})
export class NumberFormatterPipe implements PipeTransform {
    transform(value: number | undefined): string {
        if (value === 0) {
            return '0';
        }
        if (!value) {
            return '';
        }
        return value.toString(10).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
}
