import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';  // ⬅️ Importamos tap para interceptar la respuesta
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {
  private apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${environment.geminiApiKey}`;

  constructor(private http: HttpClient) {}

  sendMessageToGemini(message: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      contents: [
        {
          parts: [{ text: message }]
        }
      ]
    };

    return this.http.post(this.apiUrl, body, { headers }).pipe(
      tap({
        next: () => console.log('✅ Conexión exitosa con Gemini!'),
        error: (err) => console.error('❌ Error de conexión a Gemini:', err)
      })
    );
  }
}
