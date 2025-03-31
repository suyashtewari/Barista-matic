import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrinkService } from '../../services/drink.service';
import { InventoryService } from '../../services/inventory.service';
import { Drink } from '../../models/drink.model';
import { Subscription, timer } from 'rxjs';
import { MaterialModule } from '../../material.module';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-barista-menu',
  imports: [CommonModule, MaterialModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
    trigger('dispensingAnimation', [
      state(
        'void',
        style({
          height: '0',
          opacity: '0',
        })
      ),
      state(
        'active',
        style({
          height: '*',
          opacity: '1',
        })
      ),
      transition('void => active', animate('300ms ease-in')),
      transition('active => void', animate('300ms ease-out')),
    ]),
  ],
  templateUrl: './barista-menu.component.html',
  styleUrls: ['./barista-menu.component.scss'],
})
export class BaristaMenuComponent implements OnInit, OnDestroy {
  availableDrinks: Drink[] = [];
  isDispensing: boolean = false;
  currentDrink: Drink | null = null;
  dispensingProgress: number = 0;
  private inventorySubscription: Subscription | undefined;
  private dispensingTimerSubscription: Subscription | undefined;

  constructor(
    private drinkService: DrinkService,
    private inventoryService: InventoryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.availableDrinks = this.drinkService.getDrinks();

    this.inventorySubscription = this.inventoryService
      .getInventoryUpdates()
      .subscribe(() => {
        this.refreshDrinks();
      });
  }

  ngOnDestroy() {
    if (this.inventorySubscription) {
      this.inventorySubscription.unsubscribe();
    }

    if (this.dispensingTimerSubscription) {
      this.dispensingTimerSubscription.unsubscribe();
    }
  }

  isDrinkAvailable(drink: Drink): boolean {
    return this.inventoryService.checkIngredientAvailability(drink.ingredients);
  }

  isIngredientAvailable(name: string, units: number): boolean {
    const ingredients = this.inventoryService.getIngredients();
    const ingredient = ingredients.find((i) => i.name === name);
    return ingredient ? ingredient.currentUnits >= units : false;
  }

  getIngredientList(drink: Drink): { name: string; units: number }[] {
    return Object.entries(drink.ingredients).map(([name, units]) => ({
      name,
      units,
    }));
  }

  orderDrink(drink: Drink) {
    if (this.isDrinkAvailable(drink) && !this.isDispensing) {
      this.inventoryService.useIngredients(drink.ingredients);

      // Start dispensing animation
      this.isDispensing = true;
      this.currentDrink = drink;
      this.dispensingProgress = 0;

      // Create a timer that updates progress every 100ms for 3 seconds
      const steps = 30; // 3000ms / 100ms = 30 steps
      let currentStep = 0;

      this.dispensingTimerSubscription = timer(0, 100).subscribe(() => {
        currentStep++;
        this.dispensingProgress = (currentStep / steps) * 100;

        if (currentStep >= steps) {
          this.isDispensing = false;
          this.currentDrink = null;
          this.dispensingTimerSubscription?.unsubscribe();

          // Show success message
          this.snackBar.open(`Enjoy your ${drink.name}!`, 'Yum!', {
            duration: 2000,
          });
        }
      });
    }
  }

  private refreshDrinks() {
    this.availableDrinks = this.drinkService.getDrinks();
  }
}
