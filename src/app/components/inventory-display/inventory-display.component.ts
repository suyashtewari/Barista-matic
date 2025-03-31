import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../services/inventory.service';
import { Ingredient } from '../../models/ingredient.model';
import { Subscription } from 'rxjs';
import { MaterialModule } from '../../material.module';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-inventory-display',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
  templateUrl: './inventory-display.component.html',
  styleUrls: ['./inventory-display.component.scss'],
})
export class InventoryDisplayComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[] = [];
  displayedColumns: string[] = ['name', 'units', 'cost'];
  private inventorySubscription: Subscription | undefined;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    this.updateInventory();

    this.inventorySubscription = this.inventoryService
      .getInventoryUpdates()
      .subscribe(() => {
        this.updateInventory();
      });
  }

  ngOnDestroy() {
    if (this.inventorySubscription) {
      this.inventorySubscription.unsubscribe();
    }
  }

  getProgressColor(ingredient: Ingredient): 'primary' | 'accent' | 'warn' {
    const ratio = ingredient.currentUnits / ingredient.maxUnits;
    if (ratio < 0.3) return 'warn';
    if (ratio < 0.7) return 'accent';
    return 'primary';
  }

  allIngredientsFull(): boolean {
    return this.ingredients.every(
      (ingredient) => ingredient.currentUnits === ingredient.maxUnits
    );
  }

  restockInventory() {
    this.inventoryService.restockInventory();
  }

  private updateInventory() {
    this.ingredients = this.inventoryService.getIngredients();
  }
}
