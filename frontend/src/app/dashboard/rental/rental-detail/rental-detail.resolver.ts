import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  Router,
} from '@angular/router';

import {
  catchError,
  EMPTY,
  mergeMap,
  of,
} from 'rxjs';

import { DataService } from '../../../core/services/data.service';

export const rentalDeatailResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const dataService = inject(DataService);
  const id: number = <number><unknown>route.paramMap.get('id')!;

  return dataService.rentalsShow(id).pipe(
    mergeMap(rental => {
      return of(rental);
    }),
    catchError(() => {
      router.navigate(['/dashboard/rentals']);
      return EMPTY;
    })
  );
}
