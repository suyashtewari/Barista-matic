import { TestBed } from '@angular/core/testing';
import { InventoryService } from './inventory.service';

describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially have 10 units of each ingredient', () => {
    const ingredients = service.getIngredients();
    ingredients.forEach((ingredient) => {
      expect(ingredient.currentUnits).toBe(10);
      expect(ingredient.maxUnits).toBe(10);
    });
  });

  it('should check ingredient availability correctly', () => {
    const testIngredients = {
      Coffee: 3,
      Sugar: 1,
      Cream: 1,
    };
    expect(service.checkIngredientAvailability(testIngredients)).toBeTruthy();
  });

  it('should reduce ingredient units when used', () => {
    const testIngredients = {
      Coffee: 3,
      Sugar: 1,
      Cream: 1,
    };
    service.useIngredients(testIngredients);
    const ingredients = service.getIngredients();
    const coffee = ingredients.find((i) => i.name === 'Coffee');
    expect(coffee?.currentUnits).toBe(7);
  });
});
