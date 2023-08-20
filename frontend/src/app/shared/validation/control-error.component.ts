import {
  Component,
  Input,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';

import {
  insertRemoveAnimation,
} from 'src/app/core/animations/element-animations';

@Component({
  selector: 'app-control-error',
  template: `
    <div *ngIf="!hide()" @insertRemoveTrigger role="alert" class="mt-1 text-sm text-red-600">
      {{ control.errors | validate: name }}
    </div>`,
  styles: [`:host {margin: 0 !important;}`,],
  animations: [insertRemoveAnimation],
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
