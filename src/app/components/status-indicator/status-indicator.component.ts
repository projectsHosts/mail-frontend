import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-indicator',
    standalone: true,
  templateUrl: './status-indicator.component.html',
  styleUrls: ['./status-indicator.component.css']
})
export class StatusIndicatorComponent {
  @Input() status: 'PENDING' | 'SENT' | 'FAILED' = 'PENDING';
  @Input() message?: string;

  getStatusClass(): string {
    switch (this.status) {
      case 'PENDING': return 'status-pending';
      case 'SENT': return 'status-sent';
      case 'FAILED': return 'status-failed';
      default: return 'status-pending';
    }
  }
}