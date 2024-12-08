import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaplestoryTrackerDailyComponent } from './tracker-daily/maplestory-tracker-daily.component';

const routes: Routes = [
    { path: '', component: MaplestoryTrackerDailyComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaplestoryTrackerDailyRoutingModule { }