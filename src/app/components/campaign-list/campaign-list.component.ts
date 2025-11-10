import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { EmailService } from '../../services/email.service';
import { Campaign } from '../../models/campaign.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-campaign-list',
    standalone: true,
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.css'],
   imports: [FormsModule,CommonModule]
})
export class CampaignListComponent implements OnChanges {
  @Input() refreshTrigger = 0;
  @Output() viewCampaign = new EventEmitter<number>();
  
  
  campaigns: Campaign[] = [];
  paginatedCampaigns: Campaign[] = [];

  loading = true;
  sendingCampaignId: number | null = null;

  pageSize = 5;
  pageIndex = 0;
  totalPages = 0;

  constructor(private emailService: EmailService) {}

  ngOnChanges(): void {
    this.loadCampaigns();
  }

  loadCampaigns(): void {
    this.loading = true;
    this.emailService.getCampaigns().subscribe({
      next: (campaigns) => {
        this.campaigns = campaigns.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.updatePagination();
        this.loading = false;
      }
    });
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.campaigns.length / this.pageSize);
    const start = this.pageIndex * this.pageSize;
    this.paginatedCampaigns = this.campaigns.slice(start, start + this.pageSize);
  }

  nextPage() { this.pageIndex++; this.updatePagination(); }
  prevPage() { this.pageIndex--; this.updatePagination(); }

  confirmSend(campaignId: number) {
    Swal.fire({
      title: 'Send Campaign?',
      text: 'This will start sending emails now.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Send',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#0ea5e9'
    }).then(result => {
      if (result.isConfirmed) this.sendCampaign(campaignId);
    });
  }

  sendCampaign(campaignId: number): void {
    this.sendingCampaignId = campaignId;
    this.emailService.sendCampaign(campaignId).subscribe({
      next: (res: any) => {
        this.sendingCampaignId = null;
        Swal.fire('Success', res?.message || 'Campaign Started!', 'success');
      },
      error: () => {
        this.sendingCampaignId = null;
        Swal.fire('Error', 'Something went wrong', 'error');
      }
    });
  }
}