import { Component, OnInit, OnDestroy } from '@angular/core';
import DailiesJsonV3 from '../../../../../../../assets/Games/MaplestoryV2/Dailies.json';
import { Meta, Title } from '@angular/platform-browser';
import { GeneralData } from '../../../Models/generalData';
import { CharacterData } from '../../../Models/characterData';
import { GeneralDataService } from '../../../Services/generalData.service';
import { TaskService } from '../../../Services/task.service';

// TODO: look into seeing if its possible to also show the info thing when loading the data fails

@Component({
  selector: 'app-maplestory-tracker-weekly',
  templateUrl: './maplestory-tracker-weekly.component.html',
  styleUrls: ['./maplestory-tracker-weekly.component.css']
})
export class MaplestoryTrackerWeeklyComponent implements OnInit, OnDestroy {
  initialisationComplete: boolean = false;

  generalData: GeneralData;
  selectedCharacter: CharacterData;
 
  timers: any[] = [];
  timerStrings: string[] = ["", "", ""];

  editMode: boolean = false;

  

  constructor(private titleService: Title, private metaService: Meta, private generalDataService: GeneralDataService, private taskService: TaskService) { }

  ngOnInit() {
    this.titleService.setTitle("Maplestory Dailies Tracker | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "A weeklies tracker for Maplestory to keep track of your completed weekly tasks. Keep track of your weeklies across multiple different characters." });
    if (!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "index, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "index, follow" });
    }

    this.initialise();
  }

  ngOnDestroy() {
  }

  initialise() {
    if (localStorage.getItem("generalData")) {
      this.generalData = JSON.parse(localStorage.getItem("generalData"));
      this.taskService.weeklyUpdateChecker(this.generalData);
      this.weeklyResetChecker();

      this.fetchSelectedUserData();
    } else {
      // generate general data & 4 starting characters (it's saved in the creation step)
      this.generalData = this.generalDataService.initiateDataSet();
      
      this.fetchSelectedUserData();
    }

    // 0 starts weekly boss timer, 1 starts weekly task timer
    this.startTimer(0);
    this.startTimer(1);
    
    this.initialisationComplete = true;
  }

  fetchSelectedUserData(){
    // fetch the selected user index with an if so errors can be caught, if it doesn't exist create it for that character and maybe show a pop up?
    if(localStorage.getItem(this.generalData.characters[this.generalData.selectedCharacterIndex].characterStorageReference)) {
      this.selectedCharacter = JSON.parse(localStorage.getItem(this.generalData.characters[this.generalData.selectedCharacterIndex].characterStorageReference));
    } else {
      // TODO: potentially add a warning message bottom right pop up to tell users there was something wrong
      this.selectedCharacter = this.generalDataService.addCharacterWithExistingReference(this.generalData.characters[this.generalData.selectedCharacterIndex].characterStorageReference);
    }
  }

  weeklyResetChecker() {
    var lastThursday = this.calculateResetDayTime(4) - (7 * 24 * 60 * 60 * 1000);
    var lastMonday = this.calculateResetDayTime(1) - (7 * 24 * 60 * 60 * 1000);

    var lastVisit = parseInt(this.generalData.trackerInfo.lastWeeklyTrackerVisit);

    if (lastVisit < lastThursday) {
      this.taskService.resetWeeklyCompletionIndex(this.generalData, 0);
      this.taskService.resetWeeklyCompletionIndex(this.generalData, 2);
    }

    if (lastVisit < lastMonday) {
      this.taskService.resetWeeklyCompletionIndex(this.generalData, 1);
    }

    // set last visit to the current time
    this.generalData.trackerInfo.lastWeeklyTrackerVisit = Date.now().toString();
    this.generalDataChangeHandler();
  }

  startTimer(taskGroupIndex: number) {
    clearInterval(this.timers[taskGroupIndex]);

    var endTime;

    // if the index is 1 the reset is for Monday Reset on Sunday (1) else it is 4 which is the reset for weeklytasks on Thursday
    if (taskGroupIndex == 1) {
      endTime = this.calculateResetDayTime(1);
    } else {
      endTime = this.calculateResetDayTime(4);
    }

    this.calculateAndOutPutTimes(endTime - new Date().getTime(), taskGroupIndex);

    this.timers[taskGroupIndex] = setInterval(() => {
      var distance = endTime - new Date().getTime();
      this.calculateAndOutPutTimes(distance, taskGroupIndex);

      if (distance < 0) {
        clearInterval(this.timers[taskGroupIndex]);
        this.liveReset(taskGroupIndex);
      }
    }, 1000);
  }

  calculateResetDayTime(dayOfWeek) {
    var currentDay = new Date();
    var resultDate = new Date(Date.UTC(currentDay.getUTCFullYear(), currentDay.getUTCMonth(), currentDay.getUTCDate(), 0, 0, 0, 0));

    resultDate.setTime(resultDate.getTime() + (((7 + dayOfWeek - resultDate.getUTCDay() - 1) % 7 + 1) * 24 * 60 * 60 * 1000));

    // calculate the offset from UTC if the time to countdown is in the past it means that a week needs to be added
    // WARNING: countdowns to timezones behind utc might not work properly (Have fun future me if this needs to be added :) )
    var resultDateEpoch = resultDate.valueOf();
    resultDateEpoch = resultDateEpoch - (this.generalData.mapleRegion.resetUtcOffset * 60 * 60 * 1000)

    if (resultDateEpoch < currentDay.getTime()) {
      resultDateEpoch += (7 * 24 * 60 * 60 * 1000);
    }

    return resultDateEpoch;
  }

  calculateAndOutPutTimes(distance: number, taskGroupIndex: number) {
    if (distance < 0) {
      this.timerStrings[taskGroupIndex] = "RESET!";
      // Also show the reset text in the thursday reset weeklies
      if(taskGroupIndex == 0) {
        this.timerStrings[2] = "RESET!";
      }
      return;
    }

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.timerStrings[taskGroupIndex] = days + "d " + hours + "h " + minutes + "m " + ("00" + seconds).slice(-2) + "s ";
    // Duplicate the weekly task timer into the thursday weeklies
    if(taskGroupIndex == 0) {
      this.timerStrings[2] = this.timerStrings[taskGroupIndex];
    }
  }

  liveReset(taskGroupIndex: number) {
    this.taskService.resetWeeklyCompletionIndex(this.generalData, taskGroupIndex);
    //makes sure that thursday weekly live reset works (as there is no separate time for this)
    if (taskGroupIndex == 0) {
      this.taskService.resetWeeklyCompletionIndex(this.generalData, 2);
    }
    this.startTimer(taskGroupIndex);
    this.generalData.trackerInfo.lastWeeklyTrackerVisit = (parseInt(Date.now().toString()) + 5000).toString();
    this.generalDataChangeHandler();

    //as the resetcompletion does not return anything the updated data needs to be fetched from local storage
    this.fetchSelectedUserData();
  }


  addCharacter($event: string) {
    this.generalDataService.addCharacter(this.generalData, $event);
  }

  switchCharacter($event: number) {
    this.generalData.selectedCharacterIndex = $event;
    this.generalDataChangeHandler();
    this.fetchSelectedUserData();
  }


  changeHandler() {
    localStorage.setItem(this.generalData.characters[this.generalData.selectedCharacterIndex].characterStorageReference, JSON.stringify(this.selectedCharacter));
  }

  editModeChange($event: boolean){
    this.editMode = $event;
  }

  generalDataChangeHandler() {
    localStorage.setItem("generalData", JSON.stringify(this.generalData));
    //TODO: review this later on (might not be necessary, forgot why I added this todo lol)
    //this.checkIfAllGroupsAreDisabled();
  }

  infoChangeHandler() {
    this.generalData.trackerInfo.weeklyInfoVisible = false;
    this.generalDataChangeHandler();
  }

  regionChangeHandler() {
    this.weeklyResetChecker();
    this.startTimer(0);
    this.startTimer(1);
    this.generalDataChangeHandler();
  }
}