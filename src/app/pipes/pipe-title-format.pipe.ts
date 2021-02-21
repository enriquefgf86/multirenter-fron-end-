import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeTitleFormat'
})
export class PipeTitleFormatPipe implements PipeTransform {

  transform(url: string ): string {
    let string 
    string=url.split('/')[0];
    // console.log(string);
    
    return  string ;
  }
  //cortando el nombre de la imagen en el slash para mostra su tipo a traves de un pipe

}
