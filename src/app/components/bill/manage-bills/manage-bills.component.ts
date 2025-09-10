import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';

@Component({
  selector: 'app-manage-bills',
  imports: [RouterModule,BackButtonComponent],
  templateUrl: './manage-bills.component.html',
  styleUrl: './manage-bills.component.css'
})
export class ManageBillsComponent {

}
