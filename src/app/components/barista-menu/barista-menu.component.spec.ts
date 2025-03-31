import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { BaristaMenuComponent } from './barista-menu.component';
import { DrinkService } from '../../services/drink.service';
import { InventoryService } from '../../services/inventory.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Drink } from '../../models/drink.model';

describe('BaristaMenuComponent', () => {
  let component: BaristaMenuComponent;
  let fixture: ComponentFixture<BaristaMenuComponent>;
  let drinkService: jasmine.SpyObj<DrinkService>;
  let inventoryService: jasmine.SpyObj<InventoryService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  // Sample drinks for testing
  const mockDrinks: Drink[] = [
    {
      name: 'Coffee',
      ingredients: {
        Coffee: 3,
        Sugar: 1,
        Cream: 1,
      },
      price: 2.75,
    },
    {
      name: 'Caffe Americano',
      ingredients: {
        Espresso: 3,
      },
      price: 3.3,
    },
  ];

  beforeEach(async () => {
    // Create spies for services
    const drinkServiceSpy = jasmine.createSpyObj('DrinkService', [
      'getDrinks',
      'getDrinkByName',
    ]);
    const inventoryServiceSpy = jasmine.createSpyObj('InventoryService', [
      'checkIngredientAvailability',
      'useIngredients',
      'getIngredients',
      'getInventoryUpdates',
    ]);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [BaristaMenuComponent, NoopAnimationsModule],
      providers: [
        { provide: DrinkService, useValue: drinkServiceSpy },
        { provide: InventoryService, useValue: inventoryServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    drinkService = TestBed.inject(DrinkService) as jasmine.SpyObj<DrinkService>;
    inventoryService = TestBed.inject(
      InventoryService
    ) as jasmine.SpyObj<InventoryService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    // Configure spies
    drinkService.getDrinks.and.returnValue(mockDrinks);
    inventoryService.getInventoryUpdates.and.returnValue(of(true));
    inventoryService.checkIngredientAvailability.and.returnValue(true);
    inventoryService.getIngredients.and.returnValue([
      { name: 'Coffee', unitCost: 0.75, currentUnits: 10, maxUnits: 10 },
      { name: 'Sugar', unitCost: 0.25, currentUnits: 10, maxUnits: 10 },
      { name: 'Cream', unitCost: 0.25, currentUnits: 10, maxUnits: 10 },
      { name: 'Espresso', unitCost: 1.1, currentUnits: 10, maxUnits: 10 },
    ]);

    fixture = TestBed.createComponent(BaristaMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load drinks from service on init', () => {
    expect(drinkService.getDrinks).toHaveBeenCalled();
    expect(component.availableDrinks).toEqual(mockDrinks);
  });

  it('should check if a drink is available', () => {
    const drink = mockDrinks[0];
    component.isDrinkAvailable(drink);
    expect(inventoryService.checkIngredientAvailability).toHaveBeenCalledWith(
      drink.ingredients
    );
  });

  // Let's break this test down into simpler parts
  it('should start dispensing process when ordering a drink', () => {
    // Setup
    const drink = mockDrinks[0];
    inventoryService.checkIngredientAvailability.and.returnValue(true);

    // Execute
    component.orderDrink(drink);

    // Verify
    expect(inventoryService.useIngredients).toHaveBeenCalledWith(
      drink.ingredients
    );
    expect(component.isDispensing).toBeTrue();
    expect(component.currentDrink).toBe(drink);
  });

  it('should not allow ordering when drink is unavailable', () => {
    // Setup
    const drink = mockDrinks[0];
    inventoryService.checkIngredientAvailability.and.returnValue(false);

    // Execute
    component.orderDrink(drink);

    // Verify
    expect(inventoryService.useIngredients).not.toHaveBeenCalled();
    expect(component.isDispensing).toBeFalse();
  });

  it('should not allow ordering when already dispensing', () => {
    // Setup
    const drink1 = mockDrinks[0];
    const drink2 = mockDrinks[1];
    inventoryService.checkIngredientAvailability.and.returnValue(true);

    // Execute - order first drink
    component.orderDrink(drink1);

    // Try to order second drink while first is dispensing
    component.orderDrink(drink2);

    // Verify second order wasn't processed
    expect(inventoryService.useIngredients).toHaveBeenCalledTimes(1);
    expect(inventoryService.useIngredients).toHaveBeenCalledWith(
      drink1.ingredients
    );
  });

  it('should check if specific ingredient is available', () => {
    const result = component.isIngredientAvailable('Coffee', 3);
    expect(result).toBeTrue();
    expect(inventoryService.getIngredients).toHaveBeenCalled();
  });

  it('should get ingredient list from drink', () => {
    const drink = mockDrinks[0];
    const ingredients = component.getIngredientList(drink);

    expect(ingredients.length).toBe(3);
    expect(ingredients).toContain(
      jasmine.objectContaining({ name: 'Coffee', units: 3 })
    );
    expect(ingredients).toContain(
      jasmine.objectContaining({ name: 'Sugar', units: 1 })
    );
    expect(ingredients).toContain(
      jasmine.objectContaining({ name: 'Cream', units: 1 })
    );
  });
});
