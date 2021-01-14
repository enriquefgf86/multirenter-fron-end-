import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Interfaces } from "../interfaces/interfaces.interface";

@Injectable({
  providedIn: "root",
})
export class GetmenusService {
  components: Interfaces[] = [
    { src: "../../assets/home.svg", title: "Home", url: "/tabs/tab1" },
    {
      src: "../../assets/rentProduct.svg",
      title: "Products",
      url: "/tabs/tab2",
    },
    {
      src: "../../assets/dashboard.svg",
      title: "My dashboard",
      url: "/tabs/tab3",
    },
    {
      src: "../../assets/admin.svg",
      title: "Admin Dashboard",
      url: "/tabs/tab4",
    },
    { src: "../../assets/about.svg", title: "About Me", url: "/tabs/tab5" },
    {
      src: "../../assets/login.svg",
      title: "Login/Register",
      url: "/tabs/tab6",
    },
  ];

  constructor(private http: HttpClient) {}

  getMenusOptions() {
    // console.log(this.http.get<Interfaces[]>('../../app/jsonmenu/jsonmenu.json'));

    return this.components;
  }
}
