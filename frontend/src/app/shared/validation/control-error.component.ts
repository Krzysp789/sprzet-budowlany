import {
  animate,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  Input,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-control-error',
  template: `
    <div *ngIf="!hide()" @insertRemoveTrigger role="alert" class="mt-1 text-sm text-red-600">
      {{ control.errors | validate: name }}
    </div>`,
  styles: [`:host {margin: 0 !important;}`,],
  animations: [
    trigger('insertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: 0 }))
      ])
    ]),
  ],
})
export class ControlErrorComponent {
  @Input() control: AbstractControl
  @Input() submitted: boolean = true
  @Input() name: string = ''

  hide(): boolean {
    return !this.submitted && this.control.pristine && this.control.untouched ? true :
      this.control.errors != null && Object.keys(this.control.errors).length !== 0 ? false :
        true;
  }
}
