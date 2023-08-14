import {
  Component,
  Input,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-control-error',
  template: `
    <div role="alert" class="mt-1 text-sm text-red-600"
      [hidden]="!submitted && control.pristine && control.untouched">
      {{ control.errors | validate: name }}
    </div>`,
  styles: [`:host {margin: 0 !important;}`,],
})
export class ControlErrorComponent {
  @Input() control: AbstractControl
  @Input() submitted: boolean = true
  @Input() name: string = ''
}
