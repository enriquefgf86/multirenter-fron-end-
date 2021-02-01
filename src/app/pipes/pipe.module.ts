import { PipeImagenPipe } from "./pipe-imagen.pipe";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [PipeImagenPipe],
  imports: [CommonModule],
  exports: [PipeImagenPipe],
})
export class PipeModule {}
// Importando el [pipe a este modulo para posteriormente proceder a su importacion
// en el appmodule
