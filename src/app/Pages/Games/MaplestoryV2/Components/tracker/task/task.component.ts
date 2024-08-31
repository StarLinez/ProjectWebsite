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

  @Output() disableEvent = new EventEmitter<any>();
  //@Output() moveEvent = new EventEmitter<any>();
  @Output() changeEvent = new EventEmitter<any>();

  // moveTask(direction: string) {
  //   this.moveEvent.emit({ index: this.index, direction: direction });
  // }

  //enable/disable or complete/uncomplete.
  toggleTask() {
    if(!this.editMode) {
      this.task.done = !this.task.done;
      this.changeHandler();
    } else {
      this.disableEvent.emit(this.index);
    }
  }

  changeHandler() {
    this.changeEvent.emit();
  }

  //TODO: reimplement this
  evaluateDisplayCondition(condition: string) {
    try {
      return eval(condition);
    } catch (e) {
      return true;
    }
  }
}
