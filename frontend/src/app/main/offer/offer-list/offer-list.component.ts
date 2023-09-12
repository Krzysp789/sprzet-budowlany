import {
  Component,
  HostListener,
  OnInit,
} from '@angular/core';

import {
  LazyLoadEvent,
  SelectItem,
} from 'primeng/api';
import { Collection } from 'src/app/core/interfaces/collection';
import { Equipment } from 'src/app/core/interfaces/equipment';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-offer',
  templateUrl: './offer-list.component.html',
  styleUrls: []
})
export class OfferListComponent implements OnInit {
  equipment: Collection<Equipment> = { data: [], total: 0 };
  layout: string = 'grid';
  sortOptions: SelectItem[];
  sortKey: string = 'name';
  categories: any;
  category: string = '';
  categoryOptions: SelectItem[];
  loading: boolean = true;
  event: LazyLoadEvent | null;

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
    this.getCategories();
    if (localStorage.getItem('layout')) this.layout = <string>localStorage.getItem('layout');
  }

  loadEquipment(event: LazyLoadEvent): void {
    this.loading = true;
    this.event = event;
    this.getEquipment(this.event);
  }

  getEquipment(event: LazyLoadEvent | null = null): void {
    this.dataService.offerIndex(event, this.sortKey, this.category).subscribe((res: Collection<Equipment>) => {
      this.equipment = res;
      this.loading = false;
    });
  }

  loadNextEquipment() {
    if (this.event?.first != null) {
      this.event.first = this.event.first + 10;
      if (this.event.first + 9 < this.equipment.total && this.equipment.total != 0) {
        this.loading = true;
        this.dataService.offerIndex(this.event, this.sortKey, this.category).subscribe((res: Collection<Equipment>) => {
          this.equipment.data = this.equipment.data.concat(res.data);
          this.loading = false;
        });
      }
    }
  }

  getCategories(): void {
    this.dataService.selfCategories().subscribe(res => {
      this.categories = res;
      this.categories.forEach((x: any) => {
        this.categoryOptions.push(x);
      });
    });
  }

  changeLayout(event: { layout: string }): void {
    localStorage.setItem('layout', event.layout);
    this.layout = event.layout;
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop);
    let max = (document.documentElement.scrollHeight - document.documentElement.clientHeight);
    if (pos >= max - 10 && !this.loading) {
      this.loadNextEquipment();
    }
  }
}
