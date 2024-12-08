import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaplestoryTrackerWeeklyComponent } from './tracker-weekly/maplestory-tracker-weekly.component';

const routes: Routes = [
    { path: '', component: MaplestoryTrackerWeeklyComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaplestoryTrackerWeeklyRoutingModule { }