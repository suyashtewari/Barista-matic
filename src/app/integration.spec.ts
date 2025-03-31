import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BaristaMenuComponent } from './components/barista-menu/barista-menu.component';
import { InventoryDisplayComponent } from './components/inventory-display/inventory-display.component';
import { DrinkService } from './services/drink.service';
import { InventoryService } from './services/inventory.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('Barista-matic Integration Tests', () => {
  let fixture: ComponentFixture<AppComponent>;
  let inventoryService: InventoryService;
  let drinkService: DrinkService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        BaristaMenuComponent,
        InventoryDisplayComponent,
        NoopAnimationsModule,
        MatSnackBarModule,
      ],
      providers: [DrinkService, InventoryService, provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    inventoryService = TestBed.inject(InventoryService);
    drinkService = TestBed.inject(DrinkService);
    fixture.detectChanges();
  });

  it('should show all drinks in the menu', () => {
    const drinks = drinkService.getDrinks();
    const drinkElements = fixture.debugElement.queryAll(By.css('.drink-card'));

    expect(drinkElements.length).toBe(drinks.length);
  });

  it('should update inventory when a drink is ordered', () => {
    // Get initial inventory
    const initialInventory = inventoryService.getIngredients();
    const initialCoffeeUnits = initialInventory.find(
      (i) => i.name === 'Coffee'
    )?.currentUnits;

    // Find and click the order button for Coffee
    const coffeeCard = fixture.debugElement
      .queryAll(By.css('.drink-card'))
      .find((el) => el.nativeElement.textContent.includes('Coffee'));

    if (!coffeeCard) {
      fail('Could not find Coffee card');
      return;
    }

    const orderButton = coffeeCard.query(By.css('button'));
    orderButton.nativeElement.click();
    fixture.detectChanges();

    // Check that inventory was updated
    const updatedInventory = inventoryService.getIngredients();
    const updatedCoffeeUnits = updatedInventory.find(
      (i) => i.name === 'Coffee'
    )?.currentUnits;

    expect(updatedCoffeeUnits).toBe((initialCoffeeUnits || 0) - 3);
  });

  it('should disable ordering when inventory is insufficient', () => {
    // Use up most of the coffee
    inventoryService.useIngredients({ Coffee: 8 });
    fixture.detectChanges();

    // Find the Coffee card
    const coffeeCard = fixture.debugElement
      .queryAll(By.css('.drink-card'))
      .find((el) => el.nativeElement.textContent.includes('Coffee'));

    if (!coffeeCard) {
      fail('Could not find Coffee card');
      return;
    }

    // Check that the order button is disabled
    const orderButton = coffeeCard.query(By.css('button'));
    expect(orderButton.nativeElement.disabled).toBeTrue();
  });

  it('should correctly restock all ingredients', () => {
    // Use some ingredients
    inventoryService.useIngredients({
      Coffee: 5,
      Sugar: 3,
      Cream: 2,
      Espresso: 6,
    });
    fixture.detectChanges();

    // Find and click the restock button
    const inventoryDisplayDebug = fixture.debugElement.query(
      By.directive(InventoryDisplayComponent)
    );
    const restockButton = inventoryDisplayDebug.query(By.css('button'));
    restockButton.nativeElement.click();
    fixture.detectChanges();

    // Check that all ingredients are restored to 10
    const inventory = inventoryService.getIngredients();
    inventory.forEach((ingredient) => {
      expect(ingredient.currentUnits).toBe(10);
    });
  });
});
