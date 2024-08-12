import { Component, OnInit, OnDestroy } from '@angular/core';
import PlutusJson from '../../../../../../assets/Misc/PlutusTiers.json';
import PlutusWpJson from '../../../../../../assets/Misc/PlutusTiersWP.json';
import { Meta, Title } from '@angular/platform-browser';
import { PlutusStackingTierNew, Coin, Pluton, Tether, Fiat, PlutusStackingTier } from '../../../Models/PlutusTiers';
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
    eur: 2.25,
    gbp: 1.93
  };

  tetherPrice: Tether = {
    eur: 0.9159,
    gbp: 0.7843
  };

  stackingTiersNew: PlutusStackingTierNew[] = PlutusWpJson.stackingTiers;
  stackingTiersOld: PlutusStackingTier[] = PlutusJson.stackingTiers;

  selectedStackingTierNew = this.stackingTiersNew[0];
  selectedStackingTierOld = this.stackingTiersOld[0];

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

  countAdditionalBenefits: boolean = true;
  additionalBenefitsNew: number = 0;
  additionalBenefitsOld: number = 0;

  monthlyCashbackValueNew: number = 0;
  monthlyCashbackValueOld: number = 0;
  monthlyPerkValueNew: number = 0;
  monthlyPerkValueOld: number = 0;
  monthlyCryValueNew: number = 0;
  monthlyCryValueOld: number = 0;

  totalMonthlyValueNew: number = 0;
  totalMonthlyValueOld: number = 0;
  
  yearlyStackValuesNew: number[] = [0, 0, 0, 0, 0];
  yearlyStackValuesOld: number[] = [0, 0, 0, 0, 0];

  year1TotalValueNew: number = 0;
  year1TotalValueOld: number = 0;

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
    this.selectedStackingTierNew = this.calculateTierNew(this.heldPluCount);
    this.selectedStackingTierOld = this.calculateTierOld(this.heldPluCount);

    this.cashbackRateNew = this.calculateCashbackRateNew(this.selectedStackingTierNew, this.heldPluCount); 
    this.cashbackRateOld = this.selectedStackingTierOld.cashbackPercentage; 

    this.perkCountNew = this.selectedStackingTierNew.perkCount;
    this.perkCountOld = this.selectedStackingTierOld.perkCount;

    this.cryRateNew = this.calculateCryRate(this.cashbackRateNew, this.selectedStackingTierNew);
    this.cryRateOld = 0;

    this.eligibleSpendNew = this.calculateEligibleSpendNew(this.heldPluCount);
    this.eligibleSpendOld = 0;

    this.monthlyCashbackValueNew = this.calculateMonthlyCashback(this.eligibleSpendNew, this.cashbackRateNew); //TODO funky noob stuffs
    this.monthlyCashbackValueOld = this.calculateMonthlyCashback(this.eligibleSpendOld, this.cashbackRateOld);

    this.additionalBenefitsNew = this.calculateAdditionalBenefits(this.monthlyCashbackValueNew, this.selectedStackingTierNew);
    this.additionalBenefitsOld = 0;

    this.monthlyPerkValueNew = this.perkCountNew * 10;
    this.monthlyPerkValueOld = this.perkCountOld * 10;

    this.calculateMonthlyCryValue();

    this.totalMonthlyValueNew = this.calculateTotalMonthlyValue(this.monthlyCashbackValueNew, this.monthlyPerkValueNew, this.monthlyCryValueNew, this.additionalBenefitsNew);
    this.totalMonthlyValueOld = this.calculateTotalMonthlyValue(this.monthlyCashbackValueOld, this.monthlyPerkValueOld, this.monthlyCryValueOld, this.additionalBenefitsOld);

    this.calculateYear1TotalValue();

    this.calculateRewardsOver5YearsWithCry();
    this.calculateRewardsOver5YearsWithoutCry();
  }

  calculateTierNew(heldPlu: number) {
    if (heldPlu == null || heldPlu == undefined) {
      return this.stackingTiersNew[0];
    } else if (heldPlu >= 50000) {
      return this.stackingTiersNew[this.stackingTiersNew.length - 1];
    } else {
        for (let i = 0; i < this.stackingTiersNew.length; i++) {
          if (this.stackingTiersNew[i].pluRequired > heldPlu) {
            return this.stackingTiersNew[i - 1];
          }
        }
    }
  }

  calculateTierOld(heldPlu: number) {
    if (heldPlu == null) {
      return this.stackingTiersOld[0];
    } else if (heldPlu >= 3000) {
      return this.stackingTiersOld[this.stackingTiersOld.length - 1];
    } else {
        for (let i = 0; i < this.stackingTiersOld.length; i++) {
          if (this.stackingTiersOld[i].pluRequired > heldPlu) {
            return this.stackingTiersOld[i - 1];
          }
        }
    }
  }

  calculateCashbackRateNew(stackingTier: PlutusStackingTierNew, pluCount: number) {
    var selectedStackingTierIndex = this.stackingTiersNew.indexOf(stackingTier);

    if (stackingTier.name !== "None") {
      if (stackingTier.cashbackPercentage === this.stackingTiersNew[this.stackingTiersNew.length - 1].cashbackPercentage || this.stackingTiersNew[selectedStackingTierIndex + 1].cashbackPercentage < 4) {
        return stackingTier.cashbackPercentage;
      } else {
        var pluToNextTier = this.stackingTiersNew[selectedStackingTierIndex + 1].pluRequired - this.stackingTiersNew[selectedStackingTierIndex].pluRequired;
        var extraPlu = pluCount - stackingTier.pluRequired;
        var incrementalPercentage = Math.floor(extraPlu / pluToNextTier * 10) / 10
        return stackingTier.cashbackPercentage + incrementalPercentage;
      }
    }
    
    return stackingTier.cashbackPercentage;
  }

  calculateCryRate(cashbackRate: number, stackingTier: PlutusStackingTierNew) {
    var cryRate = 0;
    // anything with a cashbackrate of 3 will not have incremental cryrates or a cry rate above 3 so the stackingTiers default cryrate is chosen
    // anything with a cashback rate above 3 will have the same cry rate as their cashback %.
    if (cashbackRate == 3) {
      return stackingTier.cryRate;
    } else {
      return cashbackRate;
    }
  }

  calculateEligibleSpendNew(heldPlu: number) {
    if (heldPlu === null || isNaN(heldPlu)) {
      return 0;
    } else {
      return heldPlu;
    }
  }

  calculateAdditionalBenefits(monthlyCashbackValue: number, stackingTier: PlutusStackingTierNew) {
    var totalAdditionalBenefits = 0;

    if (!this.countAdditionalBenefits) {
      // return 0 and exit out of the function.
      return 0; 
    }

    if(monthlyCashbackValue > (stackingTier.doubleRewards * 20)) {
      totalAdditionalBenefits += stackingTier.doubleRewards * 20;
    } else {
      totalAdditionalBenefits += monthlyCashbackValue;
    }
  
    if (this.currencySymbol === "€") {
      totalAdditionalBenefits += stackingTier.goldenTickets * 20 * this.tetherPrice.eur;
    } else {
      totalAdditionalBenefits += stackingTier.goldenTickets * 20 * this.tetherPrice.gbp;
    }

    return totalAdditionalBenefits;
  } 

  calculateMonthlyCashback(eligibleSpend: number, cashbackRate: number) {
    return eligibleSpend * (cashbackRate / 100);
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
      this.monthlyCryValueNew = ((this.heldPluCount / 12) * pluPrice) * (this.cryRateNew / 100) * 2;
    } else {
      this.monthlyCryValueNew = intermediateMonthlyValue * (this.cryRateNew / 100) * 2;
    }
   }
  
  calculateTotalMonthlyValue(monthlyCashbackValue, monthlyPerkValue, monthlyCryValue, additionalBenefits) {
    var total = monthlyCashbackValue + monthlyPerkValue + monthlyCryValue + additionalBenefits;

    return total;
  }

  calculateYear1TotalValue() {
    this.year1TotalValueNew = (this.totalMonthlyValueNew * 12);
    this.year1TotalValueOld = (this.totalMonthlyValueOld * 12);
  }

  calculateRewardsOver5YearsWithCry() {
    if(this.heldPluCount == null || this.heldPluCount == undefined || this.heldPluCount == 0) {
      return; //exit out of the function as otherwise there will be dividing by zero.
    }

    var pluPrice = 0;
    if (this.currencySymbol === "€") {
      pluPrice = this.pluPrice.eur;
    } else {
      pluPrice = this.pluPrice.gbp;
    }

    var totalStack = this.heldPluCount; //total PLU held to which monthly cashback, perks are added constantly
    var startingStackYear = totalStack; // stack amount used to calculate cry
    var totalCryValue = 0; // totalValue gained in cry over all years (might see about returning an array of 5 values instead)
    var cryValueYearly = 0; // totalCry per year, this counter is reset for every year calculated after being added to the totalstack.

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 12; j++) {
        var stackingTier = this.calculateTierNew(totalStack);
        var cashbackRate = this.calculateCashbackRateNew(stackingTier, totalStack);
        var perkCount = stackingTier.perkCount;
        var eligibleSpend = this.calculateEligibleSpendNew(totalStack);
        var cryRate = this.calculateCryRate(cashbackRate, stackingTier);

        var monthlyCashback = this.calculateMonthlyCashback(eligibleSpend, cashbackRate);
        var monthlyPerkValue = perkCount * 10;
        var additionalBenefits = this.calculateAdditionalBenefits(monthlyCashback, stackingTier);

        // add the PLU count for the rewards value
        totalStack += (monthlyCashback + monthlyPerkValue + additionalBenefits) / pluPrice;

        // calculating cryvalue on 1/12 of the starting stack of the year so that the multiplier adjusts on a monthly basis based on the increasing PLU held (from rewards being earned)
        // taking the cryrate + (the cryrate * years) to add on the bonus of holding for multiple years without resetting it
        cryValueYearly += ((startingStackYear / 12) * pluPrice) * ((cryRate + (cryRate * (i + 1))) / 100); 
      }
      totalCryValue += cryValueYearly;
      totalStack += (cryValueYearly / pluPrice);
      this.yearlyStackValuesNew[i] = totalStack;
      cryValueYearly = 0;
      startingStackYear = totalStack;
    }
  }

  calculateRewardsOver5YearsWithoutCry() {
    if (this.heldPluCount == null || this.heldPluCount == undefined) {
      return
    }

    let pluPrice = 0;

    if (this.currencySymbol === "€") {
      pluPrice = this.pluPrice.eur;
    } else {
      pluPrice = this.pluPrice.gbp;
    }

    for (let i = 0; i < 5; i++) {
      this.yearlyStackValuesOld[i] = this.heldPluCount + (this.totalMonthlyValueOld / pluPrice * 12 * (i + 1));
    }
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

