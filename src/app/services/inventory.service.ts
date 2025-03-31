import { Injectable } from '@angular/core';
import { Ingredient } from '../models/ingredient.model';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private ingredients: Ingredient[] = [
    { name: 'Coffee', unitCost: 0.75, currentUnits: 10, maxUnits: 10 },
    { name: 'Decaf Coffee', unitCost: 0.75, currentUnits: 10, maxUnits: 10 },
    { name: 'Sugar', unitCost: 0.25, currentUnits: 10, maxUnits: 10 },
    { name: 'Cream', unitCost: 0.25, currentUnits: 10, maxUnits: 10 },
    { name: 'Steamed Milk', unitCost: 0.35, currentUnits: 10, maxUnits: 10 },
    { name: 'Foamed Milk', unitCost: 0.35, currentUnits: 10, maxUnits: 10 },
    { name: 'Espresso', unitCost: 1.1, currentUnits: 10, maxUnits: 10 },
    { name: 'Cocoa', unitCost: 0.9, currentUnits: 10, maxUnits: 10 },
    { name: 'Whipped Cream', unitCost: 1.0, currentUnits: 10, maxUnits: 10 },
  ];

  private inventoryUpdated = new BehaviorSubject<boolean>(true);

  getIngredients(): Ingredient[] {
    return _.cloneDeep(this.ingredients);
  }

  getInventoryUpdates(): Observable<boolean> {
    return this.inventoryUpdated.asObservable();
  }

  checkIngredientAvailability(requiredIngredients: {
    [key: string]: number;
  }): boolean {
    return Object.entries(requiredIngredients).every(([name, units]) => {
      const ingredient = this.ingredients.find((i) => i.name === name);
      return ingredient && ingredient.currentUnits >= units;
    });
  }

  useIngredients(requiredIngredients: { [key: string]: number }): void {
    Object.entries(requiredIngredients).forEach(([name, units]) => {
      const ingredient = this.ingredients.find((i) => i.name === name);
      if (ingredient) {
        ingredient.currentUnits -= units;
      }
    });

    // Notify subscribers that inventory has been updated
    this.inventoryUpdated.next(true);
  }

  restockInventory(): void {
    this.ingredients.forEach((ingredient) => {
      ingredient.currentUnits = ingredient.maxUnits;
    });

    // Notify subscribers that inventory has been updated
    this.inventoryUpdated.next(true);
  }
}
