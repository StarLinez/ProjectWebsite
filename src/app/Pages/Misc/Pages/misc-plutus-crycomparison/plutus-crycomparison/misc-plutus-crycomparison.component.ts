import { Component, OnInit, OnDestroy } from '@angular/core';
import PlutusJson from '../../../../../../assets/Misc/PlutusTiers.json';
import PlutusWpJson from '../../../../../../assets/Misc/PlutusTiersWP.json';
import { Meta, Title } from '@angular/platform-browser';
import { PlutusStackingTierNew, EligibleSpendTier, Coin, Pluton, Promos, Tether, Fiat, PlutusStackingTier } from '../../../Models/PlutusTiers';
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

  stackingTiersNew: PlutusStackingTierNew[] = PlutusWpJson.stackingTiers;
  stackingTiersOld: PlutusStackingTier[] = PlutusJson.stackingTiers;

  selectedStackingTierNew = this.stackingTiersNew[0];
  selectedStackingTierOld = this.stackingTiersOld[0];
  selectedStackingTierIndexNew = 0;
  selectedStackingTierIndexOld = 0;

  heldPluCount: number;
  currencySymbol: string = "€";

  cashbackRateNew: number = 0;
  cashbackRateOld: number = 0;
  perkCountNew: number = 0;
  perkCountOld: number = 0;
  cryRateNew: number = 0;
  cryRateOld: number = 0;
  eligibleSpendNew: number = 0;
  eligibleSpendOld: number = 0;

  monthlyCashbackValueNew: number = 0;
  monthlyCashbackValueOld: number = 0;
  monthlyPerkValueNew: number = 0;
  monthlyPerkValueOld: number = 0;
  monthlyCryValueNew: number = 0;
  monthlyCryValueOld: number = 0;
  monthlyCryValueYear2: number = 0;

  totalMonthlyValueNew: number = 0;
  totalMonthlyValueOld: number = 0;
  
  year1TotalValueNew: number = 0;
  year1TotalValueOld: number = 0;
  year2TotalValueNew: number = 0;
  year2TotalValueOld: number = 0;

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
    this.calculateTierNew();
    this.calculateTierOld();

    this.calculateCashbackRates();
    this.calculatePerkCounts();
    this.calculateCryRate();
    this.calculateEligibleSpends();

    this.calculateMonthlyCashback(); //TODO funky noob stuffs
    this.calculateMonthlyPerkValue();
    this.calculateMonthlyCryValue();

    this.calculateTotalMonthlyValue();
    this.calculateYear1TotalValue();
    this.calculateMonthlyCryValueYear2();
    this.calculateYear2TotalValue();
  }

  calculateTierNew() {
    if (this.heldPluCount == null) {
      this.selectedStackingTierNew = this.stackingTiersNew[0];
      this.selectedStackingTierIndexNew = 0;
    } else if (this.heldPluCount >= 50000) {
      this.selectedStackingTierNew = this.stackingTiersNew[this.stackingTiersNew.length - 1];
      this.selectedStackingTierIndexNew = this.stackingTiersNew.length - 1;
    } else {
        for (let i = 0; i < this.stackingTiersNew.length; i++) {
          if (this.stackingTiersNew[i].pluRequired > this.heldPluCount) {
            this.selectedStackingTierNew = this.stackingTiersNew[i - 1];
            this.selectedStackingTierIndexNew = i - 1;
            break;
          }
        }
    }
  }

  calculateTierOld() {
    if (this.heldPluCount == null) {
      this.selectedStackingTierOld = this.stackingTiersOld[0];
      this.selectedStackingTierIndexOld = 0;
    } else if (this.heldPluCount >= 3000) {
      this.selectedStackingTierOld = this.stackingTiersOld[this.stackingTiersOld.length - 1];
      this.selectedStackingTierIndexOld = this.stackingTiersOld.length - 1;
    } else {
        for (let i = 0; i < this.stackingTiersOld.length; i++) {
          if (this.stackingTiersOld[i].pluRequired > this.heldPluCount) {
            this.selectedStackingTierOld = this.stackingTiersOld[i - 1];
            this.selectedStackingTierIndexOld = i - 1;
            break;
          }
        }
    }
  }

  calculateCashbackRates() {
    this.cashbackRateOld = this.selectedStackingTierOld.cashbackPercentage;

    if (this.selectedStackingTierNew.name !== "None") {
      if (this.selectedStackingTierNew.cashbackPercentage === this.stackingTiersNew[this.stackingTiersNew.length - 1].cashbackPercentage || this.stackingTiersNew[this.selectedStackingTierIndexNew + 1].cashbackPercentage < 4) {
        this.cashbackRateNew = this.selectedStackingTierNew.cashbackPercentage;
      } else {
        var pluToNextTier = this.stackingTiersNew[this.selectedStackingTierIndexNew + 1].pluRequired - this.stackingTiersNew[this.selectedStackingTierIndexNew].pluRequired;
        var extraPlu = this.heldPluCount - this.selectedStackingTierNew.pluRequired;
        var incrementalPercentage = Math.floor(extraPlu / pluToNextTier * 10) / 10
        this.cashbackRateNew = this.selectedStackingTierNew.cashbackPercentage + incrementalPercentage;
      }
      return;
    }

    
    this.cashbackRateNew = this.selectedStackingTierNew.cashbackPercentage;
  }

  calculatePerkCounts() {
    this.perkCountNew = this.selectedStackingTierNew.perkCount;  
    this.perkCountOld = this.selectedStackingTierOld.perkCount;
  }

  calculateCryRate() {
    var cryRate = 0;
    if (this.cashbackRateNew == 3) {
      cryRate = this.selectedStackingTierNew.cryRate;
    } else {
      cryRate = this.cashbackRateNew;
    }
    
    this.cryRateNew = cryRate;
    this.cryRateOld = 0;
  }

  calculateEligibleSpends() {
    if (this.heldPluCount === null || isNaN(this.heldPluCount)) {
      this.eligibleSpendNew = 0;
    } else {
      this.eligibleSpendNew = this.heldPluCount;
    }
    this.eligibleSpendOld = 0;
  }

  calculateMonthlyCashback() {
    this.monthlyCashbackValueNew = this.eligibleSpendNew * (this.cashbackRateNew / 100);
    this.monthlyCashbackValueOld = this.eligibleSpendOld * (this.cashbackRateOld / 100);
  }

  calculateMonthlyPerkValue() {
    this.monthlyPerkValueNew = this.perkCountNew * 10;
    this.monthlyPerkValueOld = this.perkCountOld * 10;
  }

  calculateMonthlyCryValue() {
    var intermediateMonthlyValue = this.monthlyCashbackValueNew + this.monthlyPerkValueNew;
    var pluPrice = 0;
    if (this.currencySymbol === "€") {
      pluPrice = this.pluPrice.eur;
    } else {
      pluPrice = this.pluPrice.gbp;
    }

    // to prevent it from calculating NaN check if heldPluCount is not null
    if(this.heldPluCount != null) {
      this.monthlyCryValueNew = ((this.heldPluCount * pluPrice / 12) + intermediateMonthlyValue) * (this.cryRateNew / 100) * 2;
    } else {
      this.monthlyCryValueNew = intermediateMonthlyValue * (this.cryRateNew / 100) * 2;
    }
   }
  
  calculateTotalMonthlyValue() {
    this.totalMonthlyValueNew = this.monthlyCashbackValueNew + this.monthlyPerkValueNew + this.monthlyCryValueNew;
    this.totalMonthlyValueOld = this.monthlyCashbackValueOld + this.monthlyPerkValueOld + this.monthlyCryValueOld;
  }

  calculateYear1TotalValue() {
    this.year1TotalValueNew = (this.totalMonthlyValueNew * 12);
    this.year1TotalValueOld = (this.totalMonthlyValueOld * 12)
  }

  calculateMonthlyCryValueYear2 () {
    var intermediateMonthlyValue = this.monthlyCashbackValueNew + this.monthlyPerkValueNew;
    var pluPrice = 0;
    if (this.currencySymbol === "€") {
      pluPrice = this.pluPrice.eur;
    } else {
      pluPrice = this.pluPrice.gbp;
    }

    var heldPluAfter1Year = 0;
    // to prevent a divide by zero
    if(this.year1TotalValueNew != 0) {
      heldPluAfter1Year = (this.year1TotalValueNew / pluPrice) + this.heldPluCount;
    }

    this.monthlyCryValueYear2 = ((heldPluAfter1Year * pluPrice / 12) + intermediateMonthlyValue) * (this.cryRateNew / 100) * 3;
  }

  calculateYear2TotalValue() {
    this.year2TotalValueNew = this.year1TotalValueNew + ((this.monthlyCryValueYear2 + this.monthlyPerkValueNew + this.monthlyCashbackValueNew) * 12);

    this.year2TotalValueOld = (this.totalMonthlyValueOld * 24);
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

