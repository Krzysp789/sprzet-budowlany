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
import { DataService } from 'src/app/core/services/data.service';

export const offerDetailResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const dataService = inject(DataService);
  const id: number = <number><unknown>route.paramMap.get('id')!;

  return dataService.offerShow(id).pipe(
    mergeMap(equipment => {
      return of(equipment);
    }),
    catchError(() => {
      router.navigate(['/offer']);
      return EMPTY;
    })
  );
}
