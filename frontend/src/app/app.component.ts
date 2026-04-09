import { Component } from "@angular/core";
import { UserListComponent } from "./components/user-list/user-list.component";
import { RegisterComponent } from "./components/register/register.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [UserListComponent, RegisterComponent],
  template: `
    <app-register />
    <hr />
    <app-user-list />
  `,
})
export class AppComponent {
  title = "User CRUD App";
}
