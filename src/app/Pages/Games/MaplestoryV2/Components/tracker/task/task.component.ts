import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../Models/trackerData';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent {
  @Input() task: Task;
  @Input() title: string;
  @Input() index: number;
  @Input() imagePrefix: string;
  @Input() editMode: boolean;
  @Input() resetUtcOffset: boolean;

  @Output() disableEvent = new EventEmitter<any>();
  @Output() moveEvent = new EventEmitter<any>();
  @Output() toggleEvent = new EventEmitter<any>();

  //enable/disable or complete/uncomplete.
  toggleTask() {
    if(!this.editMode) {
      this.task.done = !this.task.done;
      this.toggleHandler();
    } else {
      this.disableEvent.emit(this.index);
    }
  }

  moveTask(direction: string) {
    this.moveEvent.emit({ index: this.index, direction: direction });
  }

  toggleHandler() {
    this.toggleEvent.emit();
  }

  evaluateDisplayCondition(condition: string) {
    try {
      return eval(condition);
    } catch (e) {
      return true;
    }
  }
}
