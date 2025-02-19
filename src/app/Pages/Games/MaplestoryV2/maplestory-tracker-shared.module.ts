import { NgModule } from "@angular/core";
// import { UrsusTaskComponent } from "../Components/task/custom-tasks/ursus-task/ursus-task.component";
// import { TaskAdderComponent } from "../Components/task-adder/task-adder.component";
// import { TopbarDefaultComponent } from "../Components/task-topbar-default/task-topbar-default.component";
// import { TopbarEditmodeComponent } from "../Components/task-topbar-editmode/task-topbar-editmode.component";
// import { CharacterNavigationBarComponent } from "../Components/task-character-navigation-bar/task-character-navigation-bar.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../Shared/shared.module";
import { TaskComponent } from "./Components/tracker/task/task.component";
import { TaskGroupComponent } from "./Components/tracker/task-group/task-group.component";
import { TaskTitlebarComponent } from "./Components/tracker/task-titlebar/task-titlebar.component";
import { CharacterSelectorComponent } from "./Components/tracker/character-selector/character-selector.component";
import { UrsusTimerComponent } from "./Components/tracker/task/task-timers/ursus-timer/ursus-timer.component";
import { YuGardenTimerComponent } from "./Components/tracker/task/task-timers/yu-garden-timer/yu-garden-timer.component";
import { TrackerNavigationComponent } from "./Components/navigation/sub-navigation/tracker-nagivation/tracker-navigation.component";
import { InfoBoxComponent } from "./Components/info-box/info-box.component";
import { ErrorBoxComponent } from "./Components/error-box/error-box.component";
import { FooterComponent } from "./Components/footer/footer.component";

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [TaskComponent, TaskGroupComponent, TaskTitlebarComponent, CharacterSelectorComponent, UrsusTimerComponent, YuGardenTimerComponent, TrackerNavigationComponent, InfoBoxComponent, ErrorBoxComponent, FooterComponent],
    exports: [TaskComponent, TaskGroupComponent, TaskTitlebarComponent, CharacterSelectorComponent, UrsusTimerComponent, YuGardenTimerComponent, TrackerNavigationComponent, InfoBoxComponent, ErrorBoxComponent, FooterComponent]
})
export class MaplestoryTrackerSharedModule { }