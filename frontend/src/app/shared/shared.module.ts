import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BooleanToWordPipe } from './pipes/boolean-to-word.pipe';
import { UnderlineToSpacePipe } from './pipes/underline-to-space.pipe';

@NgModule({
  declarations: [
    BooleanToWordPipe,
    UnderlineToSpacePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    BooleanToWordPipe,
    UnderlineToSpacePipe,
  ]
})
export class SharedModule { }
