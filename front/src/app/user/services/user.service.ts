import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserData } from '../models/user-data';
import { VkProfile } from '../types/vk-profile';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  public registration(data: UserData): Observable<HttpResponse<void>> {
    return this.http.post<any>('api/user/registration/', data, { observe: 'response' });
  }

  public getProfile(): Observable<any> {
    return this.http.get<any>('api/user/profile');
  }

}
