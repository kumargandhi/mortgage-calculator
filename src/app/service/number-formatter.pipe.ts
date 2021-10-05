import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'nf',
})
export class NumberFormatterPipe implements PipeTransform {
    transform(value: number | undefined): string {
        if (!value) {
            return '';
        }
        // .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
        return value.toString(10).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
}
