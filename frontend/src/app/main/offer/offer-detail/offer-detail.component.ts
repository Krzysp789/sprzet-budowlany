import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MessageService } from 'primeng/api';
import { Equipment } from 'src/app/core/interfaces/equipment';

import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-offer-detail',
  templateUrl: './offer-detail.component.html',
  styleUrls: []
})
export class OfferDetailComponent implements OnInit {
  id: number;
  equipment: Equipment;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    public messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getEquipment();
  }

  getEquipment(): void {
    this.route.data.subscribe(data => this.equipment = data['equipment']);
  }

  addToCart(): void {
    if (!this.cartService.equipmentInCart(this.equipment.id)) {
      this.cartService.addToCart(this.equipment);
      this.messageService.add({
        severity: 'success',
        summary: 'Dodano',
        detail: `Dodano sprzęt ${this.equipment.name} do koszyka`
      });
    }
  }

  EquipmentInCart(): boolean {
    return this.cartService.equipmentInCart(this.id);
  }
}
