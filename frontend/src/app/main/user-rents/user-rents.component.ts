import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';

import { CardModule } from 'primeng/card';
import { Rental } from 'src/app/core/interfaces/rental';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    //primeng
    CardModule,
  ],
  selector: 'app-rents',
  templateUrl: './user-rents.component.html',
  styleUrls: []
})
export class UserRentsComponent implements OnInit {
  rentals: Rental[];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getRentals();
  }

  getRentals(): void {
    this.dataService.indexRent().subscribe((res: Rental[]) => this.rentals = res);
  }

}
