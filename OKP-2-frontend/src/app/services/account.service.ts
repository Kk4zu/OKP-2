import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

interface IJWT {
    nameid: string;
    role: string;
}

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    isLoggedIn() {
    const token = this.getToken(); // Retrieve the JWT token
    return !!token;
    }

    signup(formData: FormData) {
        return this.http.post(this.baseUrl + 'signup', formData);
    }

    login(formData: FormData) {
        return this.http.post(this.baseUrl + 'login', formData)
    }

    logout() {
        localStorage.removeItem('token');
    }

    public setToken(token: string) {
        localStorage.removeItem('token');
        localStorage.setItem('token', token);
    }

    public getToken() {
        return localStorage.getItem('token') ?? '';
    }

    public getUsername() {
        const token = this.getToken();
        if (!token) return "";
        const payload = this.decodeJWT(token).payload as IJWT;
        return payload.nameid;
    }

    public getRole() {
        const token = this.getToken();
        if (!token) return "guest";
        const payload = this.decodeJWT(token).payload as IJWT;
        return payload.role;
    }

    private decodeJWT(token: string) {
        var arr = token.split('.');
        return { header: JSON.parse(atob(arr[0])), payload: JSON.parse(atob(arr[1])), secret: arr[2] }
    }

    getFavorites(token: string) {
        const headers = new HttpHeaders({
          'Authorization': 'Bearer ' + token
        });
        return this.http.get(this.baseUrl + 'favorites', { headers });
    }
    
}
