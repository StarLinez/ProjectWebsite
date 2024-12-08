import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaplestoryTrackerDailyComponent } from './tracker-daily/maplestory-tracker-daily.component';
import { MaplestoryTrackerDailyRoutingModule } from './maplestory-tracker-daily-routing.module';
import { MaplestorySharedModule } from '../../maplestory-shared.module';
import { MaplestoryTrackerSharedModule } from '../../maplestory-tracker-shared.module';



@NgModule({
    declarations: [MaplestoryTrackerDailyComponent],
    imports: [CommonModule, MaplestoryTrackerDailyRoutingModule, MaplestorySharedModule, MaplestoryTrackerSharedModule],
    exports: [MaplestoryTrackerDailyComponent]
})
export class MaplestoryTrackerDailyModule { }
