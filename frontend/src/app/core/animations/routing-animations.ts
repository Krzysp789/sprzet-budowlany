import {
  animate,
  animateChild,
  group,
  query,
  sequence,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('LeftPage => RightPage', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ], { optional: true }),
      query(':enter', [
        style({ left: '100%' })
      ], { optional: true }),
      query(':leave', animateChild(), { optional: true }),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ left: '-100%' }))
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease-out', style({ left: '0%' }))
        ], { optional: true }),
      ]),
    ]),
    transition('RightPage => LeftPage', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ], { optional: true }),
      query(':enter', [
        style({ left: '-100%' })
      ], { optional: true }),
      query(':leave', animateChild(), { optional: true }),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ left: '100%' }))
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease-out', style({ left: '0%' }))
        ], { optional: true }),
      ]),
    ]),
  ]);

export const fadeAppearAnimation =
  trigger('routeAnimations', [
    transition('Fade <=> Appear', [
      sequence([
        query(':enter', [
          style({ opacity: 0, display: 'none' })
        ], { optional: true }),
        query(':leave', animateChild(), { optional: true }),
        query(':leave', [
          animate('100ms', style({ opacity: 0 })),
          style({ display: 'none' })
        ], { optional: true }),
        query(':enter', [
          style({ display: 'block' }),
          animate('100ms', style({ opacity: 1 })),
        ], { optional: true }),
      ]),
    ]),
  ]);
