import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { UserService } from "../../services/user.service";
import { RegisterRequest, User } from "../../models/user.model";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  formData: RegisterRequest = { username: "", email: "", password: "" };
  loading = false;
  errorMessage = "";
  successMessage = "";
  registeredUser: User | null = null;

  constructor(private readonly userService: UserService) {}

  submitForm(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = "";
    this.successMessage = "";

    this.userService.register(this.formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = response.message ?? "Registration successful!";
          this.registeredUser = response.data ?? null;
          form.resetForm();
          this.formData = { username: "", email: "", password: "" };
        } else {
          const details = response.error?.details;
          this.errorMessage =
            details?.join(", ") ??
            response.error?.message ??
            "Registration failed";
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = "Failed to connect to server";
        this.loading = false;
      },
    });
  }
}
