import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskGroup, Task } from '../../../Models/trackerData';


@Component({
  selector: 'app-task-group',
  templateUrl: './task-group.component.html',
  styleUrls: ['./task-group.component.css']
})
export class TaskGroupComponent implements OnInit {
  //@Input() taskData: TaskData; // reference is passed along to make editModeActive available without requiring an event emitter if it gets changed
  @Input() taskGroup: TaskGroup;
  @Input() title: string;
  @Input() editMode: boolean;

  @Output() changeEvent = new EventEmitter<any>();

  addingCustomTask: boolean = false;
  customTaskName: string = "";
  customTaskImageUrl: string = "";

  ngOnInit() {
    this.checkIfGroupIsFullyDisabled();
  }

  moveTask(event: any) {
    if (event.direction == "up") {
      if (event.index == 0) {
        return;
      }
      var temp = this.taskGroup.tasks[event.index - 1];
      this.taskGroup.tasks[event.index - 1] = this.taskGroup.tasks[event.index];
      this.taskGroup.tasks[event.index] = temp;
    }

    if (event.direction == "down") {
      if (event.index + 1 == this.taskGroup.tasks.length) {
        return;
      }
      var temp = this.taskGroup.tasks[event.index + 1];
      this.taskGroup.tasks[event.index + 1] = this.taskGroup.tasks[event.index];
      this.taskGroup.tasks[event.index] = temp;
    }
  }

  disableTask(index: any) {
    if (this.taskGroup.tasks[index].type == "custom" || this.taskGroup.tasks[index].image == "Custom.png") {
      this.taskGroup.tasks.splice(index, 1);
    } else {
      this.taskGroup.tasks[index].enabled = !this.taskGroup.tasks[index].enabled;
    }

    this.checkIfGroupIsFullyDisabled();
  }

  checkIfGroupIsFullyDisabled() {
    if (this.taskGroup.tasks.some(item => item.enabled)) {
      this.taskGroup.allDisabled = false;
    } else {
      this.taskGroup.allDisabled = true;
    }
    this.changeHandler();
  }

  customTaskStartAdding() {
    this.addingCustomTask = true;
  }

  confirmAddingCustomTask() {
    if (this.customTaskName != "") {
      // if the user didn't specify an url set it to the default icon
      if (this.customTaskImageUrl == "") {
        this.customTaskImageUrl = "assets/TrackerImages/Custom.png";
      }

      var newTask: Task = {
        name: this.customTaskName,
        image: this.customTaskImageUrl,
        done: false,
        enabled: true,
        type: 'custom',
        dispCon: "true"
      }

      this.taskGroup.tasks.push(newTask);

      this.addingCustomTask = false;
      this.customTaskName = "";
      this.customTaskImageUrl = "";
    
      // this also kicks off changehandler
      this.checkIfGroupIsFullyDisabled();
    } else {
      this.cancelAddingCustomTask();
    }
  }

  cancelAddingCustomTask() {
    this.customTaskName = "";
    this.customTaskImageUrl = "";
    this.addingCustomTask = false;
  }

  changeHandler() {
    this.changeEvent.emit();
  }
}
