import { Pipe, PipeTransform } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";

@Pipe({
  name: "pipeImagen",
})
export class PipeImagenPipe implements PipeTransform {
  constructor(private imgFirebase: AngularFireStorage) {}

  async transform(img: string): Promise<string> {
    let string: string;

    await this.imgFirebase
      .ref(img)
      .getDownloadURL()
      .toPromise()
      .then((result) => {
        string = result;
      });
    console.log(string);
    return string;
  }
  //este archivo seria el encargado de transmutar las images traidas desde firebase mediante
  //el accesso a uno de sus metodod s y convertiralas a url retornandolas en la variable string
  //parsificados para su lectura en los tag de html esto previo pasado por pipes y despues asyn o sea
  //(imagenUrl| nombre del pipe|async)
}
