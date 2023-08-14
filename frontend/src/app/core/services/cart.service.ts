import { Injectable } from '@angular/core';

import { Delivery } from 'src/app/core/enums/delivery.enum';
import { Payment } from 'src/app/core/enums/payment.enum';

import { Equipment } from '../interfaces/equipment';
import { RentDetail } from '../interfaces/rent-detail';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  rentDetail: RentDetail;
  deliveryEnum = Delivery;
  paymentEnum = Payment;

  constructor() {
    this.rentDetail = JSON.parse(<string>localStorage.getItem('cart')) || {};
    this.rentDetail.equipment == (null || undefined)
      ? this.rentDetail.equipment = [] : '';
    this.rentDetail.dateRental == (null || undefined)
      ? this.rentDetail.dateRental = new Date().toISOString().split('T')[0] : '';
    this.rentDetail.dateDeadline == (null || undefined)
      ? this.rentDetail.dateDeadline = new Date().toISOString().split('T')[0] : '';
    this.rentDetail.delivery == (null || undefined)
      ? this.rentDetail.delivery = 1 : '';
    this.rentDetail.payment == (null || undefined)
      ? this.rentDetail.payment = 1 : '';
    this.saveRent();
  }

  get getRentDetail() {
    return this.rentDetail;
  }

  saveRent(): void {
    localStorage.setItem('cart', JSON.stringify(this.rentDetail));
  }

  addToCart(equipment: Equipment): void {
    equipment.quantity = 1;
    this.rentDetail.equipment.push(equipment);
    this.saveRent();
  }

  equipmentInCart(id: number): boolean {
    return this.rentDetail.equipment.findIndex((x: Equipment) => x.id == id) > -1;
  }

  removeEquipment(equipment: Equipment): void {
    const index = this.rentDetail.equipment.findIndex(
      (x: Equipment) => x.id === equipment.id
    );

    if (index > -1) {
      this.rentDetail.equipment.splice(index, 1);
      this.saveRent();
    }
  }

  clearEquipment(): void {
    localStorage.removeItem('cart');
    this.rentDetail.equipment = [];
    this.saveRent();
  }

  updateEquipment(equipment: Equipment): void {
    const index = this.rentDetail.equipment.findIndex(
      (x: Equipment) => x.id === equipment.id
    );

    if (index > -1) {
      this.rentDetail.equipment[index] = equipment;
    }
    this.saveRent();
  }

  setDateRental(value: string): void {
    this.rentDetail.dateRental = value;
    this.saveRent();
  }

  setDateDeadline(value: string): void {
    this.rentDetail.dateDeadline = value;
    this.saveRent();
  }

  setDelivery(value: number): void {
    this.rentDetail.delivery = value;
    this.saveRent();
  }

  setPayment(value: number): void {
    this.rentDetail.payment = value;
    this.saveRent();
  }

  setAddress(value: number): void {
    this.rentDetail.address_id = value;
    this.saveRent();
  }

  calculateCart(): number {
    let sum: number = 0;
    let days: number = this.calculateDays();
    this.rentDetail.equipment.forEach((x: Equipment) => {
      sum += x.price * <number>x.quantity * days;
    });
    return sum > 0 ? sum : 0;
  }

  calculateDelivery(): number {
    let sum: number;
    switch (this.rentDetail.delivery) {
      case this.deliveryEnum.dostawa_na_adres:
        sum = 50;
        break;
      default:
        sum = 0;
        break;
    }
    return sum;
  }

  calculatePayment(): number {
    let sum: number;
    switch (this.rentDetail.payment) {
      case this.paymentEnum.przelew:
        sum = 5;
        break;
      default:
        sum = 0;
        break;
    }
    return sum;
  }

  calculateAll(): number {
    let sum: number = 0;
    let days: number = this.calculateDays();
    this.rentDetail.equipment.forEach((x: Equipment) => {
      sum += x.price * <number>x.quantity * days;
    });
    sum += this.rentDetail.delivery == this.deliveryEnum.dostawa_na_adres ? 50 : 0;
    sum += this.rentDetail.payment == this.paymentEnum.przelew ? 5 : 0;
    return sum > 0 ? sum : 0;
  }

  calculateDays(): number {
    return Math.round((
      new Date(this.rentDetail.dateDeadline).valueOf() -
      new Date(this.rentDetail.dateRental).valueOf()
    ) / (1000 * 60 * 60 * 24)) + 1;
  }
}
