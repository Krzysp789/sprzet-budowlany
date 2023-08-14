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
  offerIndex(sort: string = 'name', cat: string = ''): Observable<Collection<Equipment>> {
    return this.http.get<Collection<Equipment>>(`${env.apiUrl}/offer`, {
      params: new HttpParams().appendAll({ sort: sort, cat: cat })
    });
  }

  offerShow(id: number): Observable<Equipment> {
    return this.http.get<Equipment>(`${env.apiUrl}/offer/${id}`);
  }

  selfCategories(): Observable<any> {
    return this.http.get(`${env.apiUrl}/selfCategories`);
  }

  //SelfRent
  indexRent(): Observable<Rental[]> {
    return this.http.get<Rental[]>(
      `${env.apiUrl}/customerRents`, { withCredentials: true }
    );
  }

  storeRent(data: any): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(
      `${env.apiUrl}/storeRent`, data, { withCredentials: true }
    );
  }

  //SelfAddress
  selfAddressIndex(): Observable<Collection<Address>> {
    return this.http.get<Collection<Address>>(
      `${env.apiUrl}/selfAddresses`, { withCredentials: true }
    );
  }

  selfAddressShow(id: number): Observable<Address> {
    return this.http.get<Address>(
      `${env.apiUrl}/selfAddresses/${id}`, { withCredentials: true }
    );
  }

  selfAddressStore(data: AddressModel): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(
      `${env.apiUrl}/selfAddresses`, data, { withCredentials: true }
    );
  }

  selfAddressUpdate(data: AddressModel, id: number): Observable<OperationResponse> {
    return this.http.patch<OperationResponse>(
      `${env.apiUrl}/selfAddresses/${id}`, data, { withCredentials: true }
    );
  }

  selfAddressDestroy(id: number): Observable<OperationResponse> {
    return this.http.delete<OperationResponse>(
      `${env.apiUrl}/selfAddresses/${id}`, { withCredentials: true }
    );
  }

  selfAddressShowActive(): Observable<Address> {
    return this.http.get<Address>(
      `${env.apiUrl}/selfAddresses/active`, { withCredentials: true }
    );
  }

  selfAddressSetActive(id: number): Observable<Address> {
    return this.http.post<Address>(
      `${env.apiUrl}/selfAddresses/${id}/active`, null, { withCredentials: true }
    );
  }

  //Category
  categoriesIndex(event: LazyLoadEvent | null = null): Observable<Collection<Category>> {
    return this.http.get<Collection<Category>>(`${env.apiUrl}/categories`, {
      params: event != null ? this.setParams(event) : new HttpParams,
      withCredentials: true,
    });
  }

  categoriesShow(id: number): Observable<Category> {
    return this.http.get<Category>(
      `${env.apiUrl}/categories/` + id, { withCredentials: true }
    );
  }

  categoriesStore(data: CategoryModel): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(
      `${env.apiUrl}/categories`, data, { withCredentials: true }
    );
  }

  categoriesUpdate(data: CategoryModel, id: number): Observable<OperationResponse> {
    return this.http.patch<OperationResponse>(
      `${env.apiUrl}/categories/` + id, data, { withCredentials: true }
    );
  }

  categoriesDestroy(id: number): Observable<OperationResponse> {
    return this.http.delete<OperationResponse>(
      `${env.apiUrl}/categories/` + id, { withCredentials: true }
    );
  }

  //Equipment
  equipmentIndex(event: LazyLoadEvent | null = null): Observable<Collection<Equipment>> {
    return this.http.get<Collection<Equipment>>(`${env.apiUrl}/equipment`, {
      params: event != null ? this.setParams(event) : new HttpParams,
      withCredentials: true,
    });
  }

  equipmentShow(id: number): Observable<Equipment> {
    return this.http.get<Equipment>(
      `${env.apiUrl}/equipment/${id}`, { withCredentials: true }
    );
  }

  equipmentStore(data: EquipmentModel): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(
      `${env.apiUrl}/equipment`, data, { withCredentials: true }
    );
  }

  equipmentUpdate(data: EquipmentModel, id: number): Observable<OperationResponse> {
    return this.http.patch<OperationResponse>(
      `${env.apiUrl}/equipment/${id}`, data, { withCredentials: true }
    );
  }

  equipmentDestroy(id: number): Observable<OperationResponse> {
    return this.http.delete<OperationResponse>(
      `${env.apiUrl}/equipment/${id}`, { withCredentials: true }
    );
  }

  //Equipment-item
  equipmentItemsIndex(idEq: number): Observable<Collection<Item>> {
    return this.http.get<Collection<Item>>(
      `${env.apiUrl}/equipment/${idEq}/items`, { withCredentials: true }
    );
  }

  equipmentItemsShow(idEq: number, idIt: number): Observable<Item> {
    return this.http.get<Item>(
      `${env.apiUrl}/equipment/${idEq}/items/` + idIt, { withCredentials: true }
    );
  }

  equipmentItemsStore(data: ItemModel, idEq: number): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(
      `${env.apiUrl}/equipment/${idEq}/items`, data, { withCredentials: true }
    );
  }

  equipmentItemsUpdate(
    data: ItemModel, idEq: number, idIt: number
  ): Observable<OperationResponse> {
    return this.http.patch<OperationResponse>(
      `${env.apiUrl}/equipment/${idEq}/items/${idIt}`, data, { withCredentials: true }
    );
  }

  equipmentItemsDestroy(idEq: number, idIt: number): Observable<OperationResponse> {
    return this.http.delete<OperationResponse>(
      `${env.apiUrl}/equipment/${idEq}/items/${idIt}`, { withCredentials: true }
    );
  }

  //Customer
  customersIndex(event: LazyLoadEvent | null = null): Observable<Collection<Customer>> {
    return this.http.get<Collection<Customer>>(`${env.apiUrl}/customers`, {
      params: event != null ? this.setParams(event) : new HttpParams,
      withCredentials: true,
    });
  }

  customersShow(id: number): Observable<Customer> {
    return this.http.get<Customer>(
      `${env.apiUrl}/customers/${id}`, { withCredentials: true }
    );
  }

  customersStore(data: CustomerModel): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(
      `${env.apiUrl}/customers`, data, { withCredentials: true }
    );
  }

  customersUpdate(data: CustomerModel, id: number): Observable<OperationResponse> {
    return this.http.patch<OperationResponse>(
      `${env.apiUrl}/customers/${id}`, data, { withCredentials: true }
    );
  }

  customersDestroy(id: number): Observable<OperationResponse> {
    return this.http.delete<OperationResponse>(
      `${env.apiUrl}/customers/${id}`, { withCredentials: true }
    );
  }

  //Customer-address
  customersAddressesIndex(idCust: number): Observable<Collection<Address>> {
    return this.http.get<Collection<Address>>(
      `${env.apiUrl}/customers/${idCust}/addresses`, { withCredentials: true }
    );
  }

  customersAddressesShow(idCust: number, idAddr: number): Observable<Address> {
    return this.http.get<Address>(
      `${env.apiUrl}/customers/${idCust}/addresses/${idAddr}`, { withCredentials: true }
    );
  }

  customersAddressesStore(
    data: AddressModel, idCust: number
  ): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(
      `${env.apiUrl}/customers/${idCust}/addresses`, data, { withCredentials: true }
    );
  }

  customersAddressesUpdate(
    data: AddressModel, idCust: number, idAddr: number
  ): Observable<OperationResponse> {
    return this.http.patch<OperationResponse>(
      `${env.apiUrl}/customers/${idCust}/addresses/${idAddr}`,
      data, { withCredentials: true }
    );
  }

  customersAddressesDestroy(
    idCust: number, idAddr: number
  ): Observable<OperationResponse> {
    return this.http.delete<OperationResponse>(
      `${env.apiUrl}/customers/${idCust}/addresses/${idAddr}`, { withCredentials: true }
    );
  }

  //Rental
  rentalsIndex(event: LazyLoadEvent | null = null): Observable<Collection<Rental>> {
    return this.http.get<Collection<Rental>>(`${env.apiUrl}/rentals`, {
      params: event != null ? this.setParams(event) : new HttpParams,
      withCredentials: true,
    });
  }

  rentalsShow(id: number): Observable<Rental> {
    return this.http.get<Rental>(
      `${env.apiUrl}/rentals/${id}`, { withCredentials: true }
    );
  }

  rentalsStore(data: RentalModel): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(
      `${env.apiUrl}/rentals`, data, { withCredentials: true }
    );
  }

  rentalsUpdate(data: RentalModel, id: number): Observable<OperationResponse> {
    return this.http.patch<OperationResponse>(
      `${env.apiUrl}/rentals/${id}`, data, { withCredentials: true }
    );
  }

  rentalsDestroy(id: number): Observable<OperationResponse> {
    return this.http.delete<OperationResponse>(
      `${env.apiUrl}/rentals/${id}`, { withCredentials: true }
    );
  }

  //Rental-Items
  rentalsItemsIndex(idRen: number): Observable<Collection<Item>> {
    return this.http.get<Collection<Item>>(
      `${env.apiUrl}/rentals/${idRen}/items`, { withCredentials: true }
    );
  }

  rentalsItemsShow(idRen: number, idItem: number): Observable<Item> {
    return this.http.get<Item>(
      `${env.apiUrl}/rentals/${idRen}/items/${idItem}`, { withCredentials: true }
    );
  }

  rentalsItemsStore(data: RentalItemModel, idRen: number): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(
      `${env.apiUrl}/rentals/${idRen}/items`, data, { withCredentials: true }
    );
  }

  rentalsItemsUpdate(
    data: RentalItemModel, idRen: number, idIt: number
  ): Observable<OperationResponse> {
    return this.http.patch<OperationResponse>(
      `${env.apiUrl}/rentals/${idRen}/items/${idIt}`, data, { withCredentials: true }
    );
  }

  rentalsItemsDestroy(idRen: number, idIt: number): Observable<OperationResponse> {
    return this.http.delete<OperationResponse>(
      `${env.apiUrl}/rentals/${idRen}/items/${idIt}`, { withCredentials: true }
    );
  }

  //Rental-Equipment
  rentalsEquipmentStore(
    data: RentalItemModel, idRen: number
  ): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(
      `${env.apiUrl}/rentals/${idRen}/equipment`, data, { withCredentials: true }
    );
  }

  rentalsEquipmentDestroy(idRen: number, idEq: number): Observable<OperationResponse> {
    return this.http.delete<OperationResponse>(
      `${env.apiUrl}/rentals/${idRen}/equipment/${idEq}`, { withCredentials: true }
    );
  }

  //Validation
  usersSearch(val: string): Observable<boolean> {
    return this.http.get<boolean>(`${env.apiUrl}/user/searchEmail`, {
      withCredentials: true,
      params: new HttpParams().append("val", val)
    });
  }

  categoriesSearch(attr: string, val: string): Observable<boolean> {
    return this.http.get<boolean>(`${env.apiUrl}/categories/search`, {
      params: new HttpParams().appendAll({ attr: attr, val: val }),
      withCredentials: true,
    });
  }

  equipmentSearch(attr: string, val: string): Observable<boolean> {
    return this.http.get<boolean>(`${env.apiUrl}/equipment/search`, {
      params: new HttpParams().appendAll({ attr: attr, val: val }),
      withCredentials: true,
    });
  }

  itemsSearch(attr: string, val: string, idEq: number): Observable<boolean> {
    return this.http.get<boolean>(`${env.apiUrl}/equipment/${idEq}/items/search`, {
      params: new HttpParams().appendAll({ attr: attr, val: val }),
      withCredentials: true,
    });
  }

  customersSearch(attr: string, val: string): Observable<boolean> {
    return this.http.get<boolean>(`${env.apiUrl}/customers/search`, {
      params: new HttpParams().appendAll({ attr: attr, val: val }),
      withCredentials: true,
    });
  }

  customersAddressesSearch(
    attr: string, val: string, idcust: number
  ): Observable<boolean> {
    return this.http.get<boolean>(`${env.apiUrl}/customers/${idcust}/addresses/search`, {
      params: new HttpParams().appendAll({ attr: attr, val: val }),
      withCredentials: true,
    });
  }

  rentalsItemsSearch(val: string, idRen: number): Observable<boolean> {
    return this.http.get<boolean>(`${env.apiUrl}/rentals/${idRen}/items/search`, {
      params: new HttpParams().append("val", val),
      withCredentials: true,
    });
  }
}

