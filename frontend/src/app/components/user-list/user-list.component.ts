import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserService } from "../../services/user.service";
import { User, CreateUserRequest, Pagination } from "../../models/user.model";

@Component({
  selector: "app-user-list",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.css"],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  pagination: Pagination | null = null;
  loading = false;
  errorMessage = "";
  successMessage = "";

  // Form state
  showForm = false;
  editingUser: User | null = null;
  formData: CreateUserRequest = { name: "", email: "" };

  get today(): string {
    return new Date().toISOString().split("T")[0];
  }

  constructor(private readonly userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = "";
    }, 3000);
  }

  loadUsers(page: number = 1): void {
    this.loading = true;
    this.errorMessage = "";
    this.userService.getUsers(page).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.users = response.data;
          this.pagination = response.pagination ?? null;
        } else {
          this.errorMessage = response.error?.message ?? "Failed to load users";
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = "Failed to connect to server";
        this.loading = false;
      },
    });
  }

  openCreateForm(): void {
    this.editingUser = null;
    this.formData = { name: "", email: "" };
    this.showForm = true;
  }

  openEditForm(user: User): void {
    this.editingUser = user;
    this.formData = { name: user.name, email: user.email, age: user.age, birthday: user.birthday };
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingUser = null;
    this.formData = { name: "", email: "" };
  }

  submitForm(): void {
    this.errorMessage = "";

    if (this.editingUser) {
      this.userService.updateUser(this.editingUser.id, this.formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.showSuccess(response.message ?? "User updated successfully");
            this.cancelForm();
            this.loadUsers(this.pagination?.page ?? 1);
          } else {
            this.errorMessage = response.error?.message ?? "Failed to update user";
          }
        },
        error: () => {
          this.errorMessage = "Failed to connect to server";
        },
      });
    } else {
      this.userService.createUser(this.formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.showSuccess(response.message ?? "User created successfully");
            this.cancelForm();
            this.loadUsers();
          } else {
            this.errorMessage = response.error?.message ?? "Failed to create user";
          }
        },
        error: () => {
          this.errorMessage = "Failed to connect to server";
        },
      });
    }
  }

  deleteUser(id: string): void {
    this.errorMessage = "";
    this.userService.deleteUser(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.showSuccess(response.message ?? "User deleted successfully");
          this.loadUsers(this.pagination?.page ?? 1);
        } else {
          this.errorMessage = response.error?.message ?? "Failed to delete user";
        }
      },
      error: () => {
        this.errorMessage = "Failed to connect to server";
      },
    });
  }

  goToPage(page: number): void {
    this.loadUsers(page);
  }
}
