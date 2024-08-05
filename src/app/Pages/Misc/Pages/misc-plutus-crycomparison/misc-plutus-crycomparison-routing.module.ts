import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MiscPlutusCryComparisonComponent } from './plutus-crycomparison/misc-plutus-crycomparison.component';

const routes: Routes = [
    { path: '', component: MiscPlutusCryComparisonComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MiscPlutusCryComparisonRoutingModule { }