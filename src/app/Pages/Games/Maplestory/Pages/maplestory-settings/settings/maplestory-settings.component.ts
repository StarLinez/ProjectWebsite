import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Settings } from '../../../Models/settings';
import { GeneralData } from '../../../../MaplestoryV2/Models/generalData';

@Component({
  selector: 'app-maplestory-settings',
  templateUrl: './maplestory-settings.component.html',
  styleUrls: ['./maplestory-settings.component.css']
})
export class MaplestorySettingsComponent implements OnInit {
  //file: any;
  // settingsToExport: string[] = ['dailiesDataV3', 'weekliesDataV3', 'arcaneSymbolSaveData', 'flameData', 'weaponFlameData'];
  settingsData: Settings = {
    generalData: "",
    characterStorageReference: [],
    characterData: [],
    arcaneSymbolSaveDataV2: "",
    sacredSymbolSaveDataV3: "",
    flameData: "",
    weaponFlameData: ""
  }
  generalData: GeneralData;

  constructor(private titleService: Title, private metaService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle("Maplestory Settings Export | Random Stuff");
    this.metaService.updateTag({ name: "description", content: "The page for exporting your saved settings for the various Maplestory calculators and trackers." });
    if (!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "index, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "index, follow" });
    }
  }

  exportSettings() {
    if (localStorage.getItem("generalData")) {
      this.settingsData.generalData = localStorage.getItem("generalData")

      this.generalData = JSON.parse(localStorage.getItem("generalData"));
      this.generalData.characters.forEach(x => {
        if (localStorage.getItem(x.characterStorageReference)) {
          this.settingsData.characterStorageReference.push(x.characterStorageReference);
          this.settingsData.characterData.push(localStorage.getItem(x.characterStorageReference))
        }
      });
    }

    if (localStorage.getItem("arcaneSymbolSaveDataV2")) {
      this.settingsData.arcaneSymbolSaveDataV2 = localStorage.getItem("arcaneSymbolSaveDataV2")
    }

    if (localStorage.getItem("sacredSymbolSaveDataV3")) {
      this.settingsData.sacredSymbolSaveDataV3 = localStorage.getItem("sacredSymbolSaveDataV3")
    }

    if (localStorage.getItem("flameData")) {
      this.settingsData.flameData = localStorage.getItem("flameData")
    }

    if (localStorage.getItem("weaponFlameData")) {
      this.settingsData.weaponFlameData = localStorage.getItem("weaponFlameData")
    }

    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(JSON.stringify(this.settingsData)));
    a.setAttribute('download', "MapleTrackerSettings.json");
    a.click()
    this.clearSettingsData();
  }


  importSettings(e) {
    var file: any = e.target.files[0];
    let fileReader = new FileReader();

    fileReader.onload = (e) => {
      try {
        this.settingsData = JSON.parse(fileReader.result.toString());
        if (this.settingsData.generalData) {
          localStorage.setItem("generalData", this.settingsData.generalData)
          
          if(this.settingsData.characterStorageReference) {
            for (let i = 0; i < this.settingsData.characterStorageReference.length; i++) {
              localStorage.setItem(this.settingsData.characterStorageReference[i], this.settingsData.characterData[i])
            }
          }
        }

        if (this.settingsData.arcaneSymbolSaveDataV2) {
          localStorage.setItem("arcaneSymbolSaveDataV2", this.settingsData.arcaneSymbolSaveDataV2)
        }

        if (this.settingsData.sacredSymbolSaveDataV3) {
          localStorage.setItem("sacredSymbolSaveDataV3", this.settingsData.sacredSymbolSaveDataV3)
        }

        if (this.settingsData.flameData) {
          localStorage.setItem("flameData", this.settingsData.flameData)
        }

        if (this.settingsData.weaponFlameData) {
          localStorage.setItem("weaponFlameData", this.settingsData.weaponFlameData)
        }

        alert("The settings have been successfully imported.");
      } catch (e) {
        alert("Something went wrong when importing the settings, make sure you are selecting the correct file.");
      }
    }

    fileReader.readAsText(file);
    this.clearSettingsData();
  }

  resetData(name: string) {
    if (localStorage.getItem(name)) {
      localStorage.removeItem(name);
    }
  }

  clearSettingsData() {
    this.settingsData = {
      generalData: "",
      characterStorageReference: [],
      characterData: [],
      arcaneSymbolSaveDataV2: "",
      sacredSymbolSaveDataV3: "",
      flameData: "",
      weaponFlameData: ""
    }
  }
}
