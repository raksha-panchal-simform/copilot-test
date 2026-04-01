import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  ApiResponse,
  User,
  CreateUserRequest,
  UpdateUserRequest,
  RegisterRequest,
} from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly apiUrl = "http://localhost:3000/api/users";
  private readonly registerUrl = "http://localhost:3000/api/register";

  constructor(private readonly http: HttpClient) {}

  getUsers(page: number = 1, limit: number = 20): Observable<ApiResponse<User[]>> {
    const params = new HttpParams()
      .set("page", page.toString())
      .set("limit", limit.toString());
    return this.http.get<ApiResponse<User[]>>(this.apiUrl, { params });
  }

  getUserById(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/${id}`);
  }

  createUser(data: CreateUserRequest): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(this.apiUrl, data);
  }

  updateUser(id: string, data: UpdateUserRequest): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/${id}`, data);
  }

  deleteUser(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

  register(data: RegisterRequest): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(this.registerUrl, data);
  }
}
