import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tracker-navigation',
  templateUrl: './tracker-navigation.component.html',
  styleUrls: ['./tracker-navigation.component.css']
})
export class TrackerNavigationComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }
}
