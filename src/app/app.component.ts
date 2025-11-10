import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CampaignListComponent } from "./components/campaign-list/campaign-list.component";
import { RecipientListComponent } from "./components/recipient-list/recipient-list.component";
import { EmailUploadComponent } from "./components/email-upload/email-upload.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, CampaignListComponent, RecipientListComponent, EmailUploadComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  selectedCampaignId: number | null = null;
  refreshTrigger = 0;

   onUploadSuccess(): void {
    this.refreshTrigger++;
    this.selectedCampaignId = null;
  }

  onViewCampaign(campaignId: number): void {
    this.selectedCampaignId = campaignId;
  }

  backToCampaigns(): void {
    this.selectedCampaignId = null;
    this.refreshTrigger++;
  }
}
