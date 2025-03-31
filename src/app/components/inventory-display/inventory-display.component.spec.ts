import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryDisplayComponent } from './inventory-display.component';
import { InventoryService } from '../../services/inventory.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';
import { Ingredient } from '../../models/ingredient.model';

describe('InventoryDisplayComponent', () => {
  let component: InventoryDisplayComponent;
  let fixture: ComponentFixture<InventoryDisplayComponent>;
  let inventoryService: jasmine.SpyObj<InventoryService>;
  let inventoryUpdateSubject: Subject<boolean>;

  // Sample ingredients for testing
  const mockIngredients: Ingredient[] = [
    { name: 'Coffee', unitCost: 0.75, currentUnits: 10, maxUnits: 10 },
    { name: 'Sugar', unitCost: 0.25, currentUnits: 5, maxUnits: 10 },
    { name: 'Cream', unitCost: 0.25, currentUnits: 2, maxUnits: 10 },
  ];

  beforeEach(async () => {
    // Create subject for controlling inventory updates
    inventoryUpdateSubject = new Subject<boolean>();

    // Create spy for inventory service
    const inventoryServiceSpy = jasmine.createSpyObj('InventoryService', [
      'getIngredients',
      'getInventoryUpdates',
      'restockInventory',
    ]);

    await TestBed.configureTestingModule({
      imports: [InventoryDisplayComponent, NoopAnimationsModule],
      providers: [{ provide: InventoryService, useValue: inventoryServiceSpy }],
    }).compileComponents();

    inventoryService = TestBed.inject(
      InventoryService
    ) as jasmine.SpyObj<InventoryService>;

    // Configure spies
    inventoryService.getIngredients.and.returnValue(mockIngredients);
    inventoryService.getInventoryUpdates.and.returnValue(
      inventoryUpdateSubject.asObservable()
    );

    fixture = TestBed.createComponent(InventoryDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Reset the call count after component initialization
    inventoryService.getIngredients.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load ingredients from service on init', () => {
    // This test doesn't need to check getIngredients call count since we reset it after initialization
    expect(component.ingredients).toEqual(mockIngredients);
  });

  it('should determine correct progress color based on ingredient levels', () => {
    // High inventory
    const highInventory: Ingredient = {
      name: 'Coffee',
      unitCost: 0.75,
      currentUnits: 10,
      maxUnits: 10,
    };
    expect(component.getProgressColor(highInventory)).toBe('primary');

    // Medium inventory
    const mediumInventory: Ingredient = {
      name: 'Sugar',
      unitCost: 0.25,
      currentUnits: 5,
      maxUnits: 10,
    };
    expect(component.getProgressColor(mediumInventory)).toBe('accent');

    // Low inventory
    const lowInventory: Ingredient = {
      name: 'Cream',
      unitCost: 0.25,
      currentUnits: 2,
      maxUnits: 10,
    };
    expect(component.getProgressColor(lowInventory)).toBe('warn');
  });

  it('should detect when all ingredients are at maximum capacity', () => {
    // With mixed inventory levels
    expect(component.allIngredientsFull()).toBeFalse();

    // With all ingredients full
    const allFullIngredients: Ingredient[] = [
      { name: 'Coffee', unitCost: 0.75, currentUnits: 10, maxUnits: 10 },
      { name: 'Sugar', unitCost: 0.25, currentUnits: 10, maxUnits: 10 },
      { name: 'Cream', unitCost: 0.25, currentUnits: 10, maxUnits: 10 },
    ];
    component.ingredients = allFullIngredients;
    expect(component.allIngredientsFull()).toBeTrue();
  });

  it('should call restock inventory when restock button is clicked', () => {
    component.restockInventory();
    expect(inventoryService.restockInventory).toHaveBeenCalled();
  });

  it('should update inventory when receiving updates from service', () => {
    // Setup new inventory data for the next update
    const updatedIngredients: Ingredient[] = [
      { name: 'Coffee', unitCost: 0.75, currentUnits: 7, maxUnits: 10 },
      { name: 'Sugar', unitCost: 0.25, currentUnits: 4, maxUnits: 10 },
      { name: 'Cream', unitCost: 0.25, currentUnits: 1, maxUnits: 10 },
    ];

    // Update the spy to return the new data
    inventoryService.getIngredients.and.returnValue(updatedIngredients);

    // Trigger the update
    inventoryUpdateSubject.next(true);

    // Verify ingredients were updated
    expect(inventoryService.getIngredients).toHaveBeenCalledTimes(1);
    expect(component.ingredients).toEqual(updatedIngredients);
  });
});
