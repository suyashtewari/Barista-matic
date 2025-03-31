import { TestBed } from '@angular/core/testing';
import { InventoryService } from './inventory.service';
import { first } from 'rxjs/operators';

describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with 10 units of each ingredient', () => {
    const ingredients = service.getIngredients();
    ingredients.forEach((ingredient) => {
      expect(ingredient.currentUnits).toBe(10);
      expect(ingredient.maxUnits).toBe(10);
    });
  });

  it('should correctly verify ingredient availability', () => {
    // Should be available because all ingredients start with 10 units
    const requiredIngredients = {
      Coffee: 3,
      Sugar: 1,
      Cream: 1,
    };
    expect(service.checkIngredientAvailability(requiredIngredients)).toBeTrue();
  });

  it('should correctly determine unavailability of ingredients', () => {
    // First use some coffee
    service.useIngredients({ Coffee: 8 });

    // Then check if we can make a coffee (requires 3 units)
    const requiredIngredients = {
      Coffee: 3,
      Sugar: 1,
      Cream: 1,
    };
    expect(
      service.checkIngredientAvailability(requiredIngredients)
    ).toBeFalse();
  });

  it('should reduce ingredient units when consumed', () => {
    const testIngredients = {
      Coffee: 3,
      Sugar: 1,
      Cream: 1,
    };

    service.useIngredients(testIngredients);

    const ingredients = service.getIngredients();
    expect(ingredients.find((i) => i.name === 'Coffee')?.currentUnits).toBe(7);
    expect(ingredients.find((i) => i.name === 'Sugar')?.currentUnits).toBe(9);
    expect(ingredients.find((i) => i.name === 'Cream')?.currentUnits).toBe(9);
  });

  it('should restock all ingredients to maximum units', () => {
    // First use some ingredients
    service.useIngredients({
      Coffee: 5,
      Sugar: 3,
      Cream: 2,
      Espresso: 6,
    });

    // Then restock
    service.restockInventory();

    // Verify all ingredients are restored to 10 units
    const ingredients = service.getIngredients();
    ingredients.forEach((ingredient) => {
      expect(ingredient.currentUnits).toBe(10);
    });
  });

  it('should notify subscribers when inventory is updated', (done) => {
    service
      .getInventoryUpdates()
      .pipe(first())
      .subscribe((updated) => {
        expect(updated).toBeTrue();
        done();
      });

    service.useIngredients({ Coffee: 1 });
  });
});
