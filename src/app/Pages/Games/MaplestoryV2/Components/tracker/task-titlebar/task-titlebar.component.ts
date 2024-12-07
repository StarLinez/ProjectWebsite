import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GeneralData, Region } from '../../../Models/generalData';

@Component({
  selector: 'app-task-titlebar',
  templateUrl: './task-titlebar.component.html',
  styleUrls: ['./task-titlebar.component.css']
})
export class TaskTitlebarComponent {
  @Input() generalData: GeneralData;
  @Input() editMode: boolean;

  @Output() addCharacterEvent = new EventEmitter<any>();
  @Output() switchCharacterEvent = new EventEmitter<any>();
  @Output() editModeChangeEvent = new EventEmitter<boolean>();
  @Output() regionChangeEvent = new EventEmitter<any>();

  regions: Array<Region> = [
    { resetUtcOffset: 0, name: 'GMS' },
    { resetUtcOffset: 8, name: 'MSEA' },
    { resetUtcOffset: 9, name: 'KMS' }
  ];

  passOnAddEvent($event: string) {
    this.addCharacterEvent.emit($event);
  }

  passOnSwitchCharacterEvent($event: number) {
    this.switchCharacterEvent.emit($event);
  }

  changeMode() {
    this.editModeChangeEvent.emit(!this.editMode);
  }

  regionChange(event: any) {
    this.generalData.mapleRegion = this.regions[event.target.selectedIndex];

    // trigger a re initialisation to make the timers adjust to the new reset & save generaldata
    this.regionChangeEvent.emit();
  }
}
