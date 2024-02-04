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

export const equipmentDeatailResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const dataService = inject(DataService);
  const id: number = <number>(<unknown>route.paramMap.get('id')!);

  return dataService.equipmentShow(id).pipe(
    mergeMap((equipment) => {
      return of(equipment);
    }),
    catchError(() => {
      router.navigate(['/dashboard/sprzet']);
      return EMPTY;
    })
  );
};
