import {
  HttpClient,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';
import { env } from 'src/envs/env';

import { Address } from '../interfaces/address';
import { Category } from '../interfaces/category';
import { Collection } from '../interfaces/collection';
import { Customer } from '../interfaces/customer';
import { Equipment } from '../interfaces/equipment';
import { Item } from '../interfaces/item';
import { OperationResponse } from '../interfaces/operation-response';
import { Rental } from '../interfaces/rental';
import { AddressModel } from '../models/address.model';
import { CategoryModel } from '../models/category.model';
import { CustomerModel } from '../models/customer.model';
import { EquipmentModel } from '../models/equipment.model';
import { ItemModel } from '../models/item.model';
import { RentalItemModel } from '../models/rental-item.model';
import { RentalModel } from '../models/rental.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) { }

  private options(params: HttpParams = new HttpParams) {
    return {
      params: params,
      withCredentials: true
    };
  }

  private setParams(event: any): HttpParams {
    let params = new HttpParams();
    Object.keys(event).forEach(key => {
      if (event[key] != null) {
        if (key == 'filters') {
          if (event[key].length > 0)
            params = params.append(key, JSON.stringify(event[key]));
        } else params = params.append(key, event[key]);
      }
    });
    return params;
  }

  // Offer
  offerIndex(
    event: LazyLoadEvent | null = null, sort: string = 'name', cat: string = ''
  ): Observable<Collection<Equipment>> {
    return this.http.get<Collection<Equipment>>(`${env.url}/offer`, this.options(
      event != null ? this.setParams(event).appendAll({ sort: sort, cat: cat }) :
        new HttpParams().appendAll({ sort: sort, cat: cat })
    ));
  }

  offerShow(id: number): Observable<Equipment> {
    return this.http.get<Equipment>(`${env.url}/offer/${id}`, this.options());
  }

  selfCategories(): Observable<any> {
    return this.http.get(`${env.url}/selfCategories`, this.options());
  }

  //SelfRent
  indexRent(): Observable<Rental[]> {
    return this.http.get<Rental[]>(`${env.url}/customerRents`, this.options());
  }

  storeRent(data: any): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(`${env.url}/storeRent`, data, this.options());
  }

  //SelfAddress
  selfAddressIndex(): Observable<Collection<Address>> {
    return this.http.get<Collection<Address>>(`${env.url}/selfAddresses`, this.options());
  }

  selfAddressShow(id: number): Observable<Address> {
    return this.http.get<Address>(`${env.url}/selfAddresses/${id}`, this.options());
  }

  selfAddressStore(data: AddressModel): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(
      `${env.url}/selfAddresses`, data, this.options()
    );
  }

  selfAddressUpdate(data: AddressModel, id: number): Observable<OperationResponse> {
    return this.http.patch<OperationResponse>(
      `${env.url}/selfAddresses/${id}`, data, this.options()
    );
  }

  selfAddressDestroy(id: number): Observable<OperationResponse> {
    return this.http.delete<OperationResponse>(
      `${env.url}/selfAddresses/${id}`, this.options()
    );
  }

  selfAddressShowActive(): Observable<Address> {
    return this.http.get<Address>(`${env.url}/selfAddresses/active`, this.options());
  }

  selfAddressSetActive(id: number): Observable<Address> {
    return this.http.post<Address>(
      `${env.url}/selfAddresses/${id}/active`, null, this.options()
    );
  }

  //Category
  categoriesIndex(event: LazyLoadEvent | null = null): Observable<Collection<Category>> {
    return this.http.get<Collection<Category>>(
      `${env.url}/categories`,
      this.options(event != null ? this.setParams(event) : new HttpParams)
    );
  }

  categoriesShow(id: number): Observable<Category> {
    return this.http.get<Category>(`${env.url}/categories/` + id, this.options());
  }

  categoriesStore(data: CategoryModel): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(
      `${env.url}/categories`, data, this.options()
    );
  }

  categoriesUpdate(data: CategoryModel, id: number): Observable<OperationResponse> {
    return this.http.patch<OperationResponse>(
      `${env.url}/categories/` + id, data, this.options()
    );
  }

  categoriesDestroy(id: number): Observable<OperationResponse> {
    return this.http.delete<OperationResponse>(
      `${env.url}/categories/` + id, this.options()
    );
  }

  //Equipment
  equipmentIndex(event: LazyLoadEvent | null = null): Observable<Collection<Equipment>> {
    return this.http.get<Collection<Equipment>>(
      `${env.url}/equipment`,
      this.options(event != null ? this.setParams(event) : new HttpParams)
    );
  }

  equipmentShow(id: number): Observable<Equipment> {
    return this.http.get<Equipment>(`${env.url}/equipment/${id}`, this.options());
  }

  equipmentStore(data: EquipmentModel): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(`${env.url}/equipment`, data, this.options());
  }

  equipmentUpdate(data: EquipmentModel, id: number): Observable<OperationResponse> {
    return this.http.patch<OperationResponse>(
      `${env.url}/equipment/${id}`, data, this.options()
    );
  }

  equipmentDestroy(id: number): Observable<OperationResponse> {
    return this.http.delete<OperationResponse>(
      `${env.url}/equipment/${id}`, this.options()
    );
  }

  equipmentUpdateImg(data: any, id: number): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(
      `${env.url}/equipment/${id}/updateImg`, data, this.options()
    );
  }

  //Equipment-item
  equipmentItemsIndex(idEq: number): Observable<Collection<Item>> {
    return this.http.get<Collection<Item>>(
      `${env.url}/equipment/${idEq}/items`, this.options()
    );
  }

  equipmentItemsShow(idEq: number, idIt: number): Observable<Item> {
    return this.http.get<Item>(
      `${env.url}/equipment/${idEq}/items/` + idIt, this.options()
    );
  }

  equipmentItemsStore(data: ItemModel, idEq: number): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(
      `${env.url}/equipment/${idEq}/items`, data, this.options()
    );
  }

  equipmentItemsUpdate(
    data: ItemModel, idEq: number, idIt: number
  ): Observable<OperationResponse> {
    return this.http.patch<OperationResponse>(
      `${env.url}/equipment/${idEq}/items/${idIt}`, data, this.options()
    );
  }

  equipmentItemsDestroy(idEq: number, idIt: number): Observable<OperationResponse> {
    return this.http.delete<OperationResponse>(
      `${env.url}/equipment/${idEq}/items/${idIt}`, this.options()
    );
  }

  //Customer
  customersIndex(event: LazyLoadEvent | null = null): Observable<Collection<Customer>> {
    return this.http.get<Collection<Customer>>(
      `${env.url}/customers`,
      this.options(event != null ? this.setParams(event) : new HttpParams)
    );
  }

  customersShow(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${env.url}/customers/${id}`, this.options());
  }

  customersStore(data: CustomerModel): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(`${env.url}/customers`, data, this.options());
  }

  customersUpdate(data: CustomerModel, id: number): Observable<OperationResponse> {
    return this.http.patch<OperationResponse>(
      `${env.url}/customers/${id}`, data, this.options()
    );
  }

  customersDestroy(id: number): Observable<OperationResponse> {
    return this.http.delete<OperationResponse>(
      `${env.url}/customers/${id}`, this.options()
    );
  }

  //Customer-address
  customersAddressesIndex(idCust: number): Observable<Collection<Address>> {
    return this.http.get<Collection<Address>>(
      `${env.url}/customers/${idCust}/addresses`, this.options()
    );
  }

  customersAddressesShow(idCust: number, idAddr: number): Observable<Address> {
    return this.http.get<Address>(
      `${env.url}/customers/${idCust}/addresses/${idAddr}`, this.options()
    );
  }

  customersAddressesStore(
    data: AddressModel, idCust: number
  ): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(
      `${env.url}/customers/${idCust}/addresses`, data, this.options()
    );
  }

  customersAddressesUpdate(
    data: AddressModel, idCust: number, idAddr: number
  ): Observable<OperationResponse> {
    return this.http.patch<OperationResponse>(
      `${env.url}/customers/${idCust}/addresses/${idAddr}`, data, this.options()
    );
  }

  customersAddressesDestroy(
    idCust: number, idAddr: number
  ): Observable<OperationResponse> {
    return this.http.delete<OperationResponse>(
      `${env.url}/customers/${idCust}/addresses/${idAddr}`, this.options()
    );
  }

  //Rental
  rentalsIndex(event: LazyLoadEvent | null = null): Observable<Collection<Rental>> {
    return this.http.get<Collection<Rental>>(
      `${env.url}/rentals`,
      this.options(event != null ? this.setParams(event) : new HttpParams)
    );
  }

  rentalsShow(id: number): Observable<Rental> {
    return this.http.get<Rental>(`${env.url}/rentals/${id}`, this.options());
  }

  rentalsStore(data: RentalModel): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(`${env.url}/rentals`, data, this.options());
  }

  rentalsUpdate(data: RentalModel, id: number): Observable<OperationResponse> {
    return this.http.patch<OperationResponse>(
      `${env.url}/rentals/${id}`, data, this.options()
    );
  }

  rentalsDestroy(id: number): Observable<OperationResponse> {
    return this.http.delete<OperationResponse>(`${env.url}/rentals/${id}`, this.options());
  }

  //Rental-Items
  rentalsItemsIndex(idRen: number): Observable<Collection<Item>> {
    return this.http.get<Collection<Item>>(
      `${env.url}/rentals/${idRen}/items`, this.options()
    );
  }

  rentalsItemsShow(idRen: number, idItem: number): Observable<Item> {
    return this.http.get<Item>(
      `${env.url}/rentals/${idRen}/items/${idItem}`, this.options()
    );
  }

  rentalsItemsStore(data: RentalItemModel, idRen: number): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(
      `${env.url}/rentals/${idRen}/items`, data, this.options()
    );
  }

  rentalsItemsUpdate(
    data: RentalItemModel, idRen: number, idIt: number
  ): Observable<OperationResponse> {
    return this.http.patch<OperationResponse>(
      `${env.url}/rentals/${idRen}/items/${idIt}`, data, this.options()
    );
  }

  rentalsItemsDestroy(idRen: number, idIt: number): Observable<OperationResponse> {
    return this.http.delete<OperationResponse>(
      `${env.url}/rentals/${idRen}/items/${idIt}`, this.options()
    );
  }

  //Rental-Equipment
  rentalsEquipmentStore(
    data: RentalItemModel, idRen: number
  ): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(
      `${env.url}/rentals/${idRen}/equipment`, data, this.options()
    );
  }

  rentalsEquipmentDestroy(idRen: number, idEq: number): Observable<OperationResponse> {
    return this.http.delete<OperationResponse>(
      `${env.url}/rentals/${idRen}/equipment/${idEq}`, this.options()
    );
  }

  //Validation
  usersSearch(val: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${env.url}/user/searchEmail`, this.options(new HttpParams().append("val", val))
    );
  }

  categoriesSearch(attr: string, val: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${env.url}/categories/search`,
      this.options(new HttpParams().appendAll({ attr: attr, val: val }))
    );
  }

  equipmentSearch(attr: string, val: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${env.url}/equipment/search`,
      this.options(new HttpParams().appendAll({ attr: attr, val: val }))
    );
  }

  itemsSearch(attr: string, val: string, idEq: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${env.url}/equipment/${idEq}/items/search`,
      this.options(new HttpParams().appendAll({ attr: attr, val: val }))
    );
  }

  customersSearch(attr: string, val: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${env.url}/customers/search`,
      this.options(new HttpParams().appendAll({ attr: attr, val: val }))
    );
  }

  customersAddressesSearch(
    attr: string, val: string, idCust: number
  ): Observable<boolean> {
    return this.http.get<boolean>(
      `${env.url}/customers/${idCust}/addresses/search`,
      this.options(new HttpParams().appendAll({ attr: attr, val: val }))
    );
  }

  rentalsItemsSearch(val: string, idRen: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${env.url}/rentals/${idRen}/items/search`,
      this.options(new HttpParams().append("val", val))
    );
  }
}

