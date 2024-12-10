import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GeneralData } from '../../../Models/generalData';


@Component({
  selector: 'app-character-selector',
  templateUrl: './character-selector.component.html',
  styleUrls: ['./character-selector.component.css']
})
export class CharacterSelectorComponent implements OnInit {
  @Input() generalData: GeneralData;

  @Output() switchCharacterEvent = new EventEmitter<any>();
  @Output() addCharacterEvent = new EventEmitter<any>();
  
  showMenu: boolean = false;

  editMode: boolean[];
  deleteMode: boolean[];
  addMode: boolean;
  changedName: string = "";
  newName: string = "";

  ngOnInit() {
    this.initiateVariables();
  }

  initiateVariables() {
    this.editMode = new Array(this.generalData.characters.length).fill(false);
    this.deleteMode = new Array(this.generalData.characters.length).fill(false);
    this.addMode = false;
    this.changedName = "";
    this.newName = "";
  }

  toggleMenu(event?: Event) {
    this.showMenu = !this.showMenu;
  }

  switchCharacter(index: number) {
    this.switchCharacterEvent.emit(index);
    //saving happens in the eventual switch method
  }

  editCharacter(index: number) {
    this.initiateVariables();
    this.editMode[index] = true;

    window.setTimeout(function () { 
      document.getElementById("editChar" + index)?.focus();
      }, 0); 
  }

  confirmEdit(index: number) {
    if (this.changedName != "") {
      this.generalData.characters[index].characterName = JSON.parse(JSON.stringify(this.changedName));
      this.ChangeHandler();
    }
    this.initiateVariables();
  }

  deleteCharacter(index: number) {
    this.initiateVariables();
    this.deleteMode[index] = true;
  }

  confirmDelete(index: number) {
    // do not allow the deletion of the final character
    if (this.generalData.characters.length == 1) {
      this.initiateVariables();
      return;
    }

    // prevent the selectedCharacter index from being out of bounds
    if (this.generalData.selectedCharacterIndex >= this.generalData.characters.length - 1) {
      this.generalData.selectedCharacterIndex = this.generalData.selectedCharacterIndex - 1;
    }

    // remove the character save data and remove the record from the characterlist
    localStorage.removeItem(this.generalData.characters[index].characterStorageReference);
    this.generalData.characters.splice(index, 1);

    this.ChangeHandler();
    this.initiateVariables();
  }

  addCharacter() {
    this.initiateVariables();
    this.addMode = true;
    
    window.setTimeout(function () { 
      document.getElementById("addChar")?.focus();
      }, 0); 
  }

  confirmAdd() {
    if (this.newName != "") {
      // add new character with eventEmitter to service.
      this.addCharacterEvent.emit(this.newName);
    }
    this.initiateVariables();
  }

  ChangeHandler() {
    localStorage.setItem("generalData", JSON.stringify(this.generalData));
  }
}
