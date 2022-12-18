import { Pipe, PipeTransform } from '@angular/core';
import { JabiyaService } from './jabiyaService/jabiya.service';

@Pipe({
  name: 'weekDay'
})
export class WeekDayPipe implements PipeTransform {

  constructor(private jabiyaService: JabiyaService) { }

  transform(value: Date, ...args: unknown[]): unknown {
    return this.jabiyaService.language.week[value.getDay()];
  }

}
