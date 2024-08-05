import { Component, OnInit, OnDestroy } from '@angular/core';
import PlutusJson from '../../../../../../assets/Misc/PlutusTiers.json';
import PlutusWpJson from '../../../../../../assets/Misc/PlutusTiersWP.json';
import { Meta, Title } from '@angular/platform-browser';
import { PlutusStackingTierNew, EligibleSpendTier, Coin, Pluton, Promos, Tether, Fiat } from '../../../Models/PlutusTiers';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-misc-plutus-crycomparison',
  templateUrl: './misc-plutus-crycomparison.component.html',
  styleUrls: ['./misc-plutus-crycomparison.component.css']
})
export class MiscPlutusCryComparisonComponent implements OnInit, OnDestroy {
  url: string = 'https://api.coingecko.com/api/v3/simple/price?ids=pluton&vs_currencies=eur%2Cgbp';
  url2: string = 'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=eur%2Cgbp';
  pluPrice: Pluton = {
    eur: 0,
    gbp: 0
  };

  tetherPrice: Tether = {
    eur: 0.921946,
    gbp: 0.776655
  };

  stackingTiers: PlutusStackingTierNew[] = PlutusWpJson.stackingTiers;
  eligibleSpendTiers: EligibleSpendTier[] = PlutusJson.eligibleSpendTiers;
  eligibleSpendTiersDefault: EligibleSpendTier[] = JSON.parse(JSON.stringify(PlutusJson.eligibleSpendTiers)); // for resetting promo changes

  selectedStackingTier = this.stackingTiers[0];
  selectedEligibleSpendTier = this.eligibleSpendTiers[0];
  selectedStackingTierIndex = 0;

  heldPluCount: number;
  currencySymbol: string = "€";
  showPromotions: boolean = false;

  cashbackRate: number = 0;
  perkCount: number = 0;
  eligibleSpend: number = 0;

  monthlyCashbackValue: number = 0;
  monthlyPerkValue: number = 0;
  monthlyCryValue: number = 0;
  totalMonthlyValue: number = 0;
  
  totalYearlyValue: number = 0;
  actualTotalYearlyValue: number = 0;

  totalValue: number[] = [0, 0, 0];
  totalActualValue: number[] = [0, 0, 0];
  totalValueMinusCost: number[] = [0, 0, 0];
  totalOriginalBenefits: number[] = [0, 0, 0];

  constructor(private titleService: Title, private metaService: Meta, private http: HttpClient) {
  }

  ngOnInit() {
    this.titleService.setTitle("Plutus CRY% vs Perks");
    this.metaService.updateTag({ name: "description", content: "Community calculator for Plutus Subscriptions & Reward Levels" });
    if (!this.metaService.getTag("name='robots'")) {
      this.metaService.addTag({ name: "robots", content: "noindex, follow" });
    } else {
      this.metaService.updateTag({ name: "robots", content: "noindex, follow" });
    }

    this.initialise();
  }

  ngOnDestroy() {
    this.titleService.setTitle("Random Stuff");
  }

  initialise() {
    if (localStorage.getItem("pluCurrencySymbol")) {
      this.currencySymbol = localStorage.getItem("pluCurrencySymbol");
    }

    // warning this fetch is not waited on, so if used for calculations, run the calculation again in this function.
    this.fetchTetherPrice();
    this.fetchPluPrice();

    this.calculate();
  }

  fetchTetherPrice() {
    const apiUrl = this.url2; // Replace with your API URL
  
    this.http.get<Fiat>(apiUrl).subscribe(data => {
      // The JSON response is now converted into a coin object 
      const usdData: Fiat = data;

      // add the values into the pluPrice object
      this.tetherPrice = usdData.tether;

      // run the calculate in here to refresh the golden ticket price and totals
      this.calculate();
    });
  }

  fetchPluPrice() {
    const apiUrl = this.url; // Replace with your API URL
  
    this.http.get<Coin>(apiUrl).subscribe(data => {
      // The JSON response is now converted into a coin object 
      const plutonData: Coin = data;

      // add the values into the pluPrice object
      this.pluPrice = plutonData.pluton;
    });
  }

  getPrices(): Observable<Pluton> {
    return this.http.get<Pluton>(this.url);
  }

  stackingTierChange(event: any) {
    this.calculate();
  }

  eligibleSpendTierChange(event: any) {
    this.calculate();
  }

  heldPluChange($event: any) {
    if(this.heldPluCount < 0) {
      this.heldPluCount = undefined;
    }

    this.calculate();
  }

  calculate() {
    this.calculateTier();
    this.calculateCashbackRate();
    this.calculatePerkCount();
    this.calculateEligibleSpend();

    this.calculateMonthlyCashback(); //TODO funky noob stuffs
    this.calculateMonthlyPerkValue();
    this.calculateMonthlyCryValue();

    this.calculateTotalMonthlyValue();
    this.calculateTotalYearlyValue();

    this.calculateActualTotalYearlyValue();
  }

  calculateTier() {
    if (this.heldPluCount == null) {
      this.selectedStackingTier = this.stackingTiers[0];
    } else if (this.heldPluCount >= 50000) {
      this.selectedStackingTier = this.stackingTiers[this.stackingTiers.length - 1];
      this.selectedStackingTierIndex = this.stackingTiers.length - 1;
    } else {
        for (let i = 0; i < this.stackingTiers.length; i++) {
          if (this.stackingTiers[i].pluRequired > this.heldPluCount) {
            this.selectedStackingTier = this.stackingTiers[i - 1];
            this.selectedStackingTierIndex = i - 1;
            break;
          }
        }
    }
  }

  calculateCashbackRate() {
    if (this.selectedStackingTier.name !== "None") {
      if (this.selectedStackingTier.cashbackPercentage === this.stackingTiers[this.stackingTiers.length - 1].cashbackPercentage || this.stackingTiers[this.selectedStackingTierIndex + 1].cashbackPercentage < 4) {
        this.cashbackRate = this.selectedStackingTier.cashbackPercentage;
      } else {
        var pluToNextTier = this.stackingTiers[this.selectedStackingTierIndex + 1].pluRequired - this.stackingTiers[this.selectedStackingTierIndex].pluRequired;
        var extraPlu = this.heldPluCount - this.selectedStackingTier.pluRequired;
        var incrementalPercentage = Math.floor(extraPlu / pluToNextTier * 10) / 10
        this.cashbackRate = this.selectedStackingTier.cashbackPercentage + incrementalPercentage;
      }
      return;
    }

    
    this.cashbackRate = this.selectedStackingTier.cashbackPercentage;
  }

  calculatePerkCount() {
    this.perkCount = this.selectedStackingTier.perkCount;  
  }

  calculateEligibleSpend() {
    if (this.heldPluCount === null || isNaN(this.heldPluCount)) {
      this.eligibleSpend = 0;
    } else {
      this.eligibleSpend = this.heldPluCount;
    }
  }

  calculateMonthlyCashback() {
    this.monthlyCashbackValue = this.eligibleSpend * (this.cashbackRate / 100);
  }

  calculateMonthlyPerkValue() {
    this.monthlyPerkValue = this.perkCount * 10;
  }

  calculateMonthlyCryValue() {
    // to prevent it from calculating NaN check if heldPluCount is not null
    var intermediateMonthlyValue = this.monthlyCashbackValue + this.monthlyPerkValue;
    var cryRate = 0;
    if (this.cashbackRate == 3) {
      cryRate = this.selectedStackingTier.cryRate / 100;
    } else {
      cryRate = this.cashbackRate / 100;
    }

    if(this.heldPluCount != null) {
      this.monthlyCryValue = ((this.heldPluCount / 12) + intermediateMonthlyValue) * cryRate * 2;
    } else {
      this.monthlyCryValue = intermediateMonthlyValue * cryRate * 2;
    }
   }
  
  calculateTotalMonthlyValue() {
    this.totalMonthlyValue = this.monthlyCashbackValue + this.monthlyPerkValue + this.monthlyCryValue;
  }

  calculateTotalYearlyValue() {
    this.totalYearlyValue = (this.totalMonthlyValue * 12);
  }

  calculateActualTotalYearlyValue() {
    this.actualTotalYearlyValue = this.totalYearlyValue;
  }

  changeCurrency() {
    if (this.currencySymbol === "€") {
      this.currencySymbol = "£";
    } else {
      this.currencySymbol = "€";
    }
    localStorage.setItem("pluCurrencySymbol", this.currencySymbol);
    this.calculate();
  }
}

