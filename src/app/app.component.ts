import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaristaMenuComponent } from './components/barista-menu/barista-menu.component';
import { InventoryDisplayComponent } from './components/inventory-display/inventory-display.component';
import { MaterialModule } from './material.module';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    BaristaMenuComponent,
    InventoryDisplayComponent,
    MaterialModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Barista-matic';
}
