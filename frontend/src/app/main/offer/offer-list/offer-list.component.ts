import {
  Component,
  OnInit,
} from '@angular/core';

import { SelectItem } from 'primeng/api';
import { Collection } from 'src/app/core/interfaces/collection';
import { Equipment } from 'src/app/core/interfaces/equipment';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-offer',
  templateUrl: './offer-list.component.html',
  styleUrls: []
})
export class OfferListComponent implements OnInit {
  equipment: Equipment[];
  layout: string = 'list';
  sortOptions: SelectItem[];
  sortKey: string = 'name';
  categories: any;
  category: string = '';
  categoryOptions: SelectItem[];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.sortOptions = [
      { label: 'Domyślne', value: 'name' },
      { label: 'Cena od najniższej', value: 'price' },
      { label: 'Cena od najwyższej', value: '!price' }
    ];
    this.categoryOptions = [
      { label: 'Wszystkie', value: '' },
    ];
    this.getEquipment();
    this.getCategories();
  }

  getEquipment(): void {
    this.dataService.offerIndex(this.sortKey, this.category).subscribe((res: Collection<Equipment>) => {
      this.equipment = res.data;
    });
  }

  getCategories(): void {
    this.dataService.selfCategories().subscribe(res => {
      this.categories = res;
      this.categories.forEach((x: any) => {
        this.categoryOptions.push(x);
      });
    });
  }
}
