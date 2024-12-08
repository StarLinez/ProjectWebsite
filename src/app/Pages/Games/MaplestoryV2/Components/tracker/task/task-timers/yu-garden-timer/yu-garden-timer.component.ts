import { Component, Input, OnInit, OnDestroy } from '@angular/core';


@Component({
  selector: 'app-yu-garden-timer',
  templateUrl: './yu-garden-timer.component.html',
  styleUrls: ['./yu-garden-timer.component.css']
})
export class YuGardenTimerComponent implements OnInit, OnDestroy{
  yuGardenTimer: any;
  yuGardenTimerString: string;
  yuGardenTimerPrefix: string;

  ngOnInit() {
    this.startYuGardenTimer();
  }

  ngOnDestroy() {

  }

  startYuGardenTimer() {
    clearInterval(this.yuGardenTimer);
    var endTime = this.determineYuGardenEndTime();

    this.calculateAndOutPutYuGardenTime(endTime - new Date().getTime());

    this.yuGardenTimer = setInterval(() => {
      var distance = endTime - new Date().getTime();
      this.calculateAndOutPutYuGardenTime(distance);

      if (distance < 0) {
        clearInterval(this.yuGardenTimer);
        this.startYuGardenTimer();
      }
    }, 1000);
  }

  determineYuGardenEndTime(): number {
    var date = new Date();

    var startTime = 18;
    var endTime = 2;

    if (date.getUTCHours() < endTime) {
      // count down to yu garden end which is the same day at 2AM
      this.yuGardenTimerPrefix = "Merchant leaves in ";
      console.log(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), endTime, 0, 0, 0));
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), endTime, 0, 0, 0);
    }

    if (date.getUTCHours() >= endTime && date.getUTCHours() < startTime) {
      // count down to yu garden start which is the current day at 6PM and after 2AM
      this.yuGardenTimerPrefix = "Merchant arrives in  ";
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), startTime, 0, 0, 0);
    }

    if (date.getUTCHours() >= startTime) {
      // count down to yu garden end which is the next day at 2AM
      this.yuGardenTimerPrefix = "Merchant leaves in ";
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1, endTime, 0, 0, 0);
    }
  }

  calculateAndOutPutYuGardenTime(distance: number) {
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.yuGardenTimerString = ("00" + hours).slice(-2) + "h " + ("00" + minutes).slice(-2) + "m " + ("00" + seconds).slice(-2) + "s ";
  }
}
