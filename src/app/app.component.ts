import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CampaignListComponent } from "./components/campaign-list/campaign-list.component";
import { RecipientListComponent } from "./components/recipient-list/recipient-list.component";
import { EmailUploadComponent } from "./components/email-upload/email-upload.component";
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from "@angular/router";
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, CampaignListComponent, RecipientListComponent, EmailUploadComponent, RouterOutlet,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  selectedCampaignId: number | null = null;
  refreshTrigger = 0;
  currentUserEmail: string = '';


// ✅ login/signup routes ke liye flag
  isAuthRoute = false;
  showUserCard = false;

   constructor(public auth: AuthService,  private router: Router) {
    // 🔥 yahi se isAuthRoute set hoga
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        const url: string = e.urlAfterRedirects;
        // console.log('URL => ', url);  // debug ke liye

        this.isAuthRoute =
          url.startsWith('/login') || url.startsWith('/signup');
      });
   }

    toggleUserCard() {
    this.showUserCard = !this.showUserCard;
  }

  logout() {
    this.auth.logout();
    window.location.reload();
  }

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

  
goToCampaigns() {
    this.selectedCampaignId = null;
    this.router.navigate(['/dashboard']).then(() => {
      this.refreshTrigger++;
    });
  }
}
