import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FileUploadService {
  private apiUrl = "https://your-backend-api.com/upload"; // Replace with actual API URL

  constructor(private http: HttpClient) {}

  // File Upload API Call
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append("file", file);

    const headers = new HttpHeaders(); // Add headers if required, e.g., auth tokens

    return this.http.post(this.apiUrl, formData, { headers });
  }
}
