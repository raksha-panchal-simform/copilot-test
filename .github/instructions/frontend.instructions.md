---
description: "Use when writing or editing Angular components, services, or frontend UI code. Covers component patterns, service injection, and TypeScript typing."
applyTo: "frontend/src/**"
---

# Frontend Instructions (Angular)

## Component Standards

- Use standalone Angular components with TypeScript
- Define typed interfaces in `models/` for all data structures
- Use dependency injection for services via `constructor(private readonly ...)`
- Keep components focused — one responsibility per component

## Example Pattern

```typescript
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserService } from "../../services/user.service";
import { User } from "../../models/user.model";

@Component({
  selector: "app-user-list",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngFor="let user of users">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
    </div>
  `,
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  constructor(private readonly userService: UserService) {}
  ngOnInit(): void { this.loadUsers(); }
  loadUsers(): void { /* ... */ }
}
```

## Rules

- Never use `any` — always define a typed interface
- Use optional chaining for nullable data from API responses
- Handle loading and error states in every component that fetches data
- Consume the standard `ApiResponse<T>` type when working with API data
- Use `Observable` and `subscribe` for async API calls in services
