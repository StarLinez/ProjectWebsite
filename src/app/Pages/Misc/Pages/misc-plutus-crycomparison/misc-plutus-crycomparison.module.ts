import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiscPlutusCryComparisonComponent } from './plutus-crycomparison/misc-plutus-crycomparison.component';
import { MiscPlutusCryComparisonRoutingModule } from './misc-plutus-crycomparison-routing.module';
import { SharedModule } from '../../../../Shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [MiscPlutusCryComparisonComponent],
    imports: [CommonModule, SharedModule, MiscPlutusCryComparisonRoutingModule, NgSelectModule, FormsModule],
    exports: [MiscPlutusCryComparisonComponent]
})
export class MiscPlutusCryComparisonModule { }
