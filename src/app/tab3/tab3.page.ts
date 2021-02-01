import { tokengenerated } from './../interfaces/interfaces.interface';
import { StorageService } from './../services/storage.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  constructor(private storageService:StorageService) {

  }
  ngOnInit():void{
    this.storageService.getTokenInStorage().then((data:tokengenerated)=>{
      console.log(data);
      
    })
  }

}
