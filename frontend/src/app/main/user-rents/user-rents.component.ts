import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';

import { CardModule } from 'primeng/card';
import { Rental } from 'src/app/core/interfaces/rental';
import { DataService } from 'src/app/core/services/data.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
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

  calculateDays(dateRental: any, dateDeadline: any): number {
    return Math.round((
      new Date(dateDeadline).valueOf() -
      new Date(dateRental).valueOf()
    ) / (1000 * 60 * 60 * 24)) + 1;
  }

}
