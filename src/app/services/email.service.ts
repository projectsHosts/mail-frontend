import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Campaign, Recipient, UploadRequest } from '../models/campaign.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Upload Excel and create campaign
  uploadCampaign(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/email/upload`, formData);
  }

  // Get all campaigns
  getCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.apiUrl}/email/campaigns`);
  }

  // Get campaign by ID
  getCampaign(campaignId: number): Observable<Campaign> {
    return this.http.get<Campaign>(`${this.apiUrl}/email/campaign/${campaignId}`);
  }

  // Get campaign recipients
  getRecipients(campaignId: number): Observable<Recipient[]> {
    return this.http.get<Recipient[]>(`${this.apiUrl}/email/campaign/${campaignId}/recipients`);
  }

  // Send campaign emails
  
  sendCampaign(campaignId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/email/campaign/${campaignId}/send`, {});
  }
}