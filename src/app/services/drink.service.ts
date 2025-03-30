// src/app/services/drink.service.ts
import { Injectable } from '@angular/core';
import { Drink } from '../models/drink.model';
import { InventoryService } from './inventory.service';

@Injectable({
  providedIn: 'root',
})
export class DrinkService {
  private drinks: Drink[] = [
    {
      name: 'Coffee',
      ingredients: {
        Coffee: 3,
        Sugar: 1,
        Cream: 1,
      },
      price: 0,
    },
    {
      name: 'Decaf Coffee',
      ingredients: {
        'Decaf Coffee': 3,
        Sugar: 1,
        Cream: 1,
      },
      price: 0,
    },
    {
      name: 'Caffe Latte',
      ingredients: {
        Espresso: 2,
        'Steamed Milk': 1,
      },
      price: 0,
    },
    {
      name: 'Caffe Americano',
      ingredients: {
        Espresso: 3,
      },
      price: 0,
    },
    {
      name: 'Caffe Mocha',
      ingredients: {
        Espresso: 1,
        Cocoa: 1,
        'Steamed Milk': 1,
        'Whipped Cream': 1,
      },
      price: 0,
    },
    {
      name: 'Cappuccino',
      ingredients: {
        Espresso: 2,
        'Steamed Milk': 1,
        'Foamed Milk': 1,
      },
      price: 0,
    },
  ];

  constructor(private inventoryService: InventoryService) {
    this.calculateDrinkPrices();
  }

  private calculateDrinkPrices(): void {
    this.drinks.forEach((drink) => {
      drink.price = Object.entries(drink.ingredients).reduce(
        (total, [ingredient, units]) => {
          const ingredientDetails = this.inventoryService
            .getIngredients()
            .find((i) => i.name === ingredient);
          return total + (ingredientDetails?.unitCost || 0) * units;
        },
        0
      );
    });
  }

  getDrinks(): Drink[] {
    return this.drinks;
  }

  getDrinkByName(name: string): Drink | undefined {
    return this.drinks.find((drink) => drink.name === name);
  }
}
