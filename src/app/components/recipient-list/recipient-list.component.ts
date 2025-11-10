import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Recipient } from '../../models/campaign.model';
import { EmailService } from '../../services/email.service';
import { StatusIndicatorComponent } from "../status-indicator/status-indicator.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipient-list',
    standalone: true,
  templateUrl: './recipient-list.component.html',
  styleUrls: ['./recipient-list.component.css'],
  imports: [StatusIndicatorComponent,FormsModule,CommonModule]
})
export class RecipientListComponent implements OnChanges, OnDestroy {
  @Input() campaignId: number | null = null;


  recipients: Recipient[] = [];
  loading = false;
  autoRefresh = false;
  private refreshInterval: any;

  constructor(private emailService: EmailService) {}

  ngOnChanges(): void {
    this.loadRecipients();
    this.setupAutoRefresh();
  }

  loadRecipients(): void {
    if (!this.campaignId) return;

    this.loading = true;
    this.emailService.getRecipients(this.campaignId).subscribe({
      next: (recipients) => {
        this.recipients = recipients;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading recipients:', error);
        this.loading = false;
      }
    });
  }

  setupAutoRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    if (this.autoRefresh && this.campaignId) {
      this.refreshInterval = setInterval(() => {
        this.loadRecipients();
      }, 3000);
    }
  }

  get pendingCount(): number {
    return this.recipients.filter(r => r.status === 'PENDING').length;
  }

  get sentCount(): number {
    return this.recipients.filter(r => r.status === 'SENT').length;
  }

  get failedCount(): number {
    return this.recipients.filter(r => r.status === 'FAILED').length;
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
}