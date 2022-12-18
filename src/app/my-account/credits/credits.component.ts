import { Component, OnInit } from '@angular/core';
import { LANGUAGE } from 'src/app/util/constants';
@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss'],
})
export class CreditsComponent implements OnInit {
  public language:any;
  public languageJson={
    creditPage:{
      spanish :{
        detail : 'Detalles de crédito',
        tquota: 'Cupo de crédito total',
        quota: 'Cupo de crédito disponible',
        currentdebit:'Deuda actual',
        debit: 'Deuda en mora',
        condition: 'Condicion de pa go',
        credit:'Crédito',
      },
    english:{
      detail : 'Credit details',
      tquota: 'Total credit quota',
      quota: 'Credit quota available',
      currentdebit:'Current debt',
      debit: 'Delinquent debt',
      condition: 'Payment condition',
      credit:'Credit',
    }
  }}
  constructor() { 
    this.language=localStorage.getItem(LANGUAGE);
  }

  ngOnInit() {}

}
