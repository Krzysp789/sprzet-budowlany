import {
  Pipe,
  PipeTransform,
} from '@angular/core';

@Pipe({
  name: 'underlineToSpace'
})
export class UnderlineToSpacePipe implements PipeTransform {

  transform(value: string): string {
    if (value == undefined || null) { return '' };
    return value.replaceAll('_', ' ');
  }

}
