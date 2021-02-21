import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeProductDetailsRent'
})
export class PipeProductDetailsRentPipe implements PipeTransform {

  transform(idProduct: string, ): unknown {
    return null;
  }

}
