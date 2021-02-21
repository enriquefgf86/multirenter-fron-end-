import { PipeImagenPipe } from "./pipe-imagen.pipe";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PipeTitleFormatPipe } from './pipe-title-format.pipe';
import { PipeProductDetailsRentPipe } from './pipe-product-details-rent.pipe';

@NgModule({
  declarations: [PipeImagenPipe, PipeTitleFormatPipe, PipeProductDetailsRentPipe],
  imports: [CommonModule],
  exports: [PipeImagenPipe, PipeTitleFormatPipe],
})
export class PipeModule {}
// Importando el [pipe a este modulo para posteriormente proceder a su importacion
// en el appmodule
