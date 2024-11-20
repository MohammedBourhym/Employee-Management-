import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  baseUrl = 'http://localhost:3000/api/employees/download';
  constructor(private http: HttpClient) {}

  downloadTable(type : 'json'| 'csv') {
    return this.http.get(this.baseUrl +'/'+type, {
      responseType: 'blob', // Ensure we handle binary data
    });
  }

  downloadFile(bucket: string, fileName: string) {
    return this.http.get(`http://localhost:3000/download-file/${bucket}/${fileName}`, {
      responseType: 'blob', // Handle binary data
    });
  }
}
