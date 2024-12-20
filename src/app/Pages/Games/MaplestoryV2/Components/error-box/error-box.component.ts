import { Component } from '@angular/core';

@Component({
  selector: 'app-error-box',
  templateUrl: './error-box.component.html',
  styleUrls: ['./error-box.component.css']
})
export class ErrorBoxComponent {

  resetData() {
    // only general data needs to be reset as any other data will be overwritten when creating new characters.
    if (localStorage.getItem("generalData")) {
      localStorage.removeItem("generalData");
    }
    window.location.reload();
  }
}
