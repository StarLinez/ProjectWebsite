import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.css']
})
export class InfoBoxComponent {
  @Input() title: string = "";
  @Input() text: string = "";

  @Output() dismissEvent = new EventEmitter<any>();

  dismiss() {
    this.dismissEvent.emit();
  }
}
