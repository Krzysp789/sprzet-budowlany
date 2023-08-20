import {
  animate,
  query,
  sequence,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const insertRemoveAnimation =
  trigger('insertRemoveTrigger', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('100ms', style({ opacity: 1 })),
    ]),
    transition(':leave', [
      animate('100ms', style({ opacity: 0 }))
    ])
  ])

export const switchAnimation =
  trigger('switchTrigger', [
    transition('* <=> *', [
      sequence([
        query(':enter', [
          style({ opacity: 0, display: 'none' })
        ], { optional: true }),
        query(':leave', [
          animate('100ms', style({ opacity: 0 })),
          style({ display: 'none' })
        ], { optional: true }),
        query(':enter', [
          style({ display: 'flex' }),
          animate('100ms', style({ opacity: 1 })),
        ], { optional: true }),
      ]),
    ]),
  ])
