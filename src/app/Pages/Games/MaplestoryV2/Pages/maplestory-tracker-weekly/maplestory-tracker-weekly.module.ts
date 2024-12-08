import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaplestoryTrackerWeeklyComponent } from './tracker-weekly/maplestory-tracker-weekly.component';
import { MaplestoryTrackerWeeklyRoutingModule } from './maplestory-tracker-weekly-routing.module';
import { MaplestorySharedModule } from '../../maplestory-shared.module';
import { MaplestoryTrackerSharedModule } from '../../maplestory-tracker-shared.module';



@NgModule({
    declarations: [MaplestoryTrackerWeeklyComponent],
    imports: [CommonModule, MaplestoryTrackerWeeklyRoutingModule, MaplestorySharedModule, MaplestoryTrackerSharedModule],
    exports: [MaplestoryTrackerWeeklyComponent]
})
export class MaplestoryTrackerWeeklyModule { }
