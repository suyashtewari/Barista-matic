import { TestBed } from '@angular/core/testing';
import { DrinkService } from './drink.service';
import { InventoryService } from './inventory.service';

describe('DrinkService', () => {
  let service: DrinkService;
  let inventoryService: InventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrinkService, InventoryService],
    });
    service = TestBed.inject(DrinkService);
    inventoryService = TestBed.inject(InventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should provide a list of all available drinks', () => {
    const drinks = service.getDrinks();

    // Should have 6 drinks total
    expect(drinks.length).toBe(6);

    // Verify all drink names are present
    const drinkNames = drinks.map((d) => d.name);
    expect(drinkNames).toContain('Coffee');
    expect(drinkNames).toContain('Decaf Coffee');
    expect(drinkNames).toContain('Caffe Latte');
    expect(drinkNames).toContain('Caffe Americano');
    expect(drinkNames).toContain('Caffe Mocha');
    expect(drinkNames).toContain('Cappuccino');
  });

  it('should correctly find a drink by name', () => {
    const coffee = service.getDrinkByName('Coffee');
    expect(coffee).toBeDefined();
    expect(coffee?.name).toBe('Coffee');
    expect(coffee?.ingredients['Coffee']).toBe(3);
    expect(coffee?.ingredients['Sugar']).toBe(1);
    expect(coffee?.ingredients['Cream']).toBe(1);
  });

  it('should return undefined for non-existent drink name', () => {
    const nonExistentDrink = service.getDrinkByName('Green Tea');
    expect(nonExistentDrink).toBeUndefined();
  });

  it('should correctly calculate drink prices based on ingredient costs', () => {
    const drinks = service.getDrinks();

    // Get the ingredient costs from inventory service
    const ingredients = inventoryService.getIngredients();
    const costs: Record<string, number> = {};

    ingredients.forEach((i) => {
      costs[i.name] = i.unitCost;
    });

    // Test coffee price calculation: 3 × Coffee + 1 × Sugar + 1 × Cream
    const coffee = drinks.find((d) => d.name === 'Coffee');
    const expectedCoffeePrice =
      costs['Coffee'] * 3 + costs['Sugar'] * 1 + costs['Cream'] * 1;
    expect(coffee?.price).toBeCloseTo(expectedCoffeePrice, 2);

    // Test Caffe Americano: 3 × Espresso
    const americano = drinks.find((d) => d.name === 'Caffe Americano');
    const expectedAmericanoPrice = costs['Espresso'] * 3;
    expect(americano?.price).toBeCloseTo(expectedAmericanoPrice, 2);

    // Test Caffe Mocha: 1 × Espresso + 1 × Cocoa + 1 × Steamed Milk + 1 × Whipped Cream
    const mocha = drinks.find((d) => d.name === 'Caffe Mocha');
    const expectedMochaPrice =
      costs['Espresso'] * 1 +
      costs['Cocoa'] * 1 +
      costs['Steamed Milk'] * 1 +
      costs['Whipped Cream'] * 1;
    expect(mocha?.price).toBeCloseTo(expectedMochaPrice, 2);
  });
});
