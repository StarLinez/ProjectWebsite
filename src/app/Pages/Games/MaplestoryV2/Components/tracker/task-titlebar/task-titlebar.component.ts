import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GeneralData } from '../../../Models/generalData';

@Component({
  selector: 'app-task-titlebar',
  templateUrl: './task-titlebar.component.html',
  styleUrls: ['./task-titlebar.component.css']
})
export class TaskTitlebarComponent {
  @Input() generalData: GeneralData;

  @Output() addCharacterEvent = new EventEmitter<any>();
  @Output() switchCharacterEvent = new EventEmitter<any>();

  passOnAddEvent($event: string) {
    this.addCharacterEvent.emit($event);
  }

  passOnSwitchCharacterEvent($event: number) {
    this.switchCharacterEvent.emit($event);
  }
}
