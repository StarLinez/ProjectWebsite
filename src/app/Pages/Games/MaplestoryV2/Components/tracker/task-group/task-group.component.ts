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
  @Input() resetUtcOffset: boolean;
  @Input() imagePrefix: string;

  @Output() changeEvent = new EventEmitter<any>();

  addingCustomTask: boolean = false;
  customTaskName: string = "";
  customTaskImageUrl: string = "";
  eventTasks: Task[];

  totalEnabledTasks: number = 0;
  totalCompleted: number = 0;
  //TODO: check this when calculating completion (if 100 mark this as true)
  selectAll: boolean = false;

  ngOnInit() {
    this.checkIfGroupIsFullyDisabled();
    this.calculateProgress();
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

    this.changeHandler();
  }

  disableTask(index: any) {
    this.taskGroup.tasks[index].enabled = !this.taskGroup.tasks[index].enabled;

    this.checkIfGroupIsFullyDisabled();
    this.calculateProgress();
  }

  removeCustomTask(index: any) {
    this.taskGroup.tasks.splice(index, 1);
  }

  checkIfGroupIsFullyDisabled() {
    // go over each task and as soon as an enabled one is found return false and exit otherwise keep checking.
    // set the value to true to then set it to false as soon as an enabled task is found.
    this.taskGroup.allDisabled = true;

    for (let i = 0; i < this.taskGroup.tasks.length; i++) {
      if(this.taskGroup.tasks[i].enabled && eval(this.taskGroup.tasks[i].dispCon)) {
        this.taskGroup.allDisabled = false;
        break;
      }
    }

    this.changeHandler();
  }

  calculateProgress() {
    // two counters on for the total count of enabled&displayed tasks another for their completion
    this.totalEnabledTasks = 0;
    this.totalCompleted = 0;
    this.taskGroup.tasks.forEach(task => {
      if(task.enabled && eval(task.dispCon)) {
        this.totalEnabledTasks += 1;

        if(task.done) {
          this.totalCompleted += 1;
        }
      }
    });

    this.checkSelectAll();
  }

  toggleSelectAll() {
    if(!this.selectAll) {
      this.taskGroup.tasks.forEach(task => {
        task.done = true;
      });
    } else {
      this.taskGroup.tasks.forEach(task => {
        task.done = false;
      });
    }
    this.selectAll = !this.selectAll;
    this.calculateProgress();
    this.changeHandler();
  }

  checkSelectAll() {
    if(this.totalEnabledTasks / this.totalCompleted == 1) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }
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
      this.calculateProgress();
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

  toggleHandler() {
    this.calculateProgress();
    this.changeEvent.emit();
  }
}
