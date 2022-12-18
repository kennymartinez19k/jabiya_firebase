// app/translate/translate.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundValue',
  pure: false // impure pipe, update value when we change language
})
export class RoundValuePipe implements PipeTransform {

  transform(value: number, args: any[]): any {
    if (!value || typeof(value) != 'number') return value;
    if (value == NaN ) return 0;

    var formatter = new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    });

    return formatter.format(value).replace('DOP', 'RD$');;
  }
}


import { NgModule } from '@angular/core';

@NgModule({
  imports: [],
  declarations: [RoundValuePipe],
  exports: [RoundValuePipe],
})
export class PipeModule {

  static forRoot() {
    return {
      ngModule: PipeModule,
      providers: [],
    };
  }
} 