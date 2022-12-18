import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { JabiyaService } from 'src/app/services/jabiyaService/jabiya.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements AfterViewInit, OnDestroy {

  @ViewChild(IonSlides) subscriptionSlider: IonSlides;
  @Output() passDate = new EventEmitter();
  @Input() datePeriods: any;
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false
  };
  currentWeek = [];
  showCalendar = false;
  initialSlide = 0;
  currentMonth: Date;
  monthText = '';
  activeSlideIndex = 0;
  public dateRange: any;

  constructor(private jabiyaService: JabiyaService) { }

  ngAfterViewInit() {
    this.initializeDate();
  }

  initializeDate() {
    const dates = this.getDates(this.datePeriods[0], this.datePeriods[1]);
    const today = new Date();
    this.currentWeek = new Array();
    const newArray = [];
    startDay: for (let i = 0; i < dates.length; i++) {
      let n = 0;
      if (dates[i].getDay() === 0) {
        for (let k = i; k < dates.length - (dates.length % 7); k++) {
          newArray[n] = new Array();
          for (let j = k; j < k + 7 && j < dates.length; j++) {
            const value = { date: dates[j], disable: false, today: false };
            const check = value.date;
            if (today.getDate() === check.getDate() && today.getMonth() === check.getMonth() &&
              today.getFullYear() === check.getFullYear()) {
              value.today = true;
              this.initialSlide = Math.round(j / 7) - 1;
              this.currentMonth = value.date;
              // this.currMonthChanged();
            }
            newArray[n].push(value);
          }
          n = n + 1;
          k = k + 6;
        }
        break startDay;
      }
    }
    this.currentWeek = newArray;
    this.showCalendar = true;
    setTimeout(() => {
      this.subscriptionSlider?.slideTo(this.initialSlide);
    }, 200);
  }

  getDates(startDate: Date, stopDate: Date) {
    const dateArray = new Array();
    let currentDate = new Date(startDate);
    const weekEndDate = new Date(stopDate);
    while (currentDate <= weekEndDate) {
      dateArray.push(new Date(currentDate));
      currentDate = this.addDays(new Date(currentDate), 1);
    }
    return dateArray;
  }

  addDays(date: Date, days: number) {
    date.setDate(date.getDate() + days);
    return date;
  }

  sliderChanges() {
    this.subscriptionSlider.getActiveIndex().then(async index => {
      this.moveWeekByClick(index);
    });
  }

  moveWeekByClick(index) {
    this.currentMonth = this.currentWeek[index][0].date;

    this.subscriptionSlider.slideTo(index);
    const lastIndex = this.currentWeek[index].length === 7 ? 6 : this.currentWeek[index].length - 1;
    this.dateRange = [
      this.jabiyaService.getGeneralFormatDate(this.currentWeek[index][0].date),
      this.jabiyaService.getGeneralFormatDate(this.currentWeek[index][lastIndex].date)];
    this.passDate.emit(this.dateRange);
    this.activeSlideIndex = index;
    this.currMonthChanged();
  }

  currMonthChanged() {
    const lastIndex = this.currentWeek[this.activeSlideIndex].length === 7 ? 6 : this.currentWeek[this.activeSlideIndex].length - 1;
    const year = this.currentMonth.getFullYear();
    const month = this.jabiyaService.language.months[this.currentMonth.getMonth()];
    const day = this.currentMonth.getDay();
    this.monthText = this.jabiyaService.getRangeFormatDate(this.currentWeek[this.activeSlideIndex][0].date, 'from') + this.jabiyaService.getRangeFormatDate(this.currentWeek[this.activeSlideIndex][lastIndex].date, 'to');
  }

  changeDateView(onePosition: number, index: number, disable: boolean, enable: boolean): Promise<void> {
    return new Promise((resolve) => {
      let monthChanged = false;
      for (let i = 0; i < onePosition; i++) {
        this.currentWeek[index][i].disable = disable;
        if (!disable && !monthChanged) {
          monthChanged = true;
          this.currentMonth = this.currentWeek[index][i].date;
          this.currMonthChanged();
        }
      }
      for (let i = onePosition; i < this.currentWeek[index].length; i++) {
        this.currentWeek[index][i].disable = enable;
        if (!enable && !monthChanged) {
          monthChanged = true;
          this.currentMonth = this.currentWeek[index][i].date;
          this.currMonthChanged();
        }
      }
      resolve();
    });
  }

  async getDateDetails(value, index) {
    if (value.disable) {
      await this.setWeek(index);
      const weekValues = JSON.parse(JSON.stringify(this.currentWeek[index]));
      for (let k = 0; k < weekValues.length; k++) {
        if (weekValues[k].disable) {
          weekValues.splice(k, 1);
          k--;
        }
      }
      this.passDate.emit([
        this.jabiyaService.getGeneralFormatDate(weekValues[0].date),
        this.jabiyaService.getGeneralFormatDate(weekValues[weekValues.length - 1].date)]);
    }
  }

  setWeek(index: number): Promise<void> {
    return new Promise(resolve => {
      for (const val of this.currentWeek[index]) {
        val.disable = !val.disable;
        if (!val.disable) {
          this.currentMonth = val.date;
          this.currMonthChanged();
        }
      }
      resolve();
    });
  }

  gotoPrevMonth() {
    const searchDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 0);
    for (let i = 0; i < this.currentWeek.length; i++) {
      for (const weekDay of this.currentWeek[i]) {
        const week = weekDay;
        if (week.date.getDate() === searchDate.getDate() && week.date.getMonth() === searchDate.getMonth() &&
          week.date.getFullYear() === searchDate.getFullYear()) {
          this.activeSlideIndex = i;
          this.subscriptionSlider.slideTo(i);
          this.currMonthChanged();
          this.getDateDetails(week, i);
          setTimeout(() => {
            this.getDateDetails(week, i);
          }, 500);
        }
      }
    }
  }

  gotoNextMonth() {
    const searchDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    for (let i = 0; i < this.currentWeek.length; i++) {
      for (const weekDay of this.currentWeek[i]) {
        const week = weekDay;
        if (week.date.getDate() === searchDate.getDate() && week.date.getMonth() === searchDate.getMonth() &&
          week.date.getFullYear() === searchDate.getFullYear()) {
          this.subscriptionSlider.slideTo(i);
          this.getDateDetails(week, i);
          setTimeout(() => {
            this.getDateDetails(week, i);
          }, 500);
        }
      }
    }
  }



  ngOnDestroy() {
    this.passDate.emit(null);
    this.datePeriods = null;
    this.subscriptionSlider = null;
    this.slideOpts = null;
    this.currentWeek = null;
    this.showCalendar = null;
    this.initialSlide = null;
    this.currentMonth = null;
    this.monthText = null;
    this.activeSlideIndex = null;
  }
}
