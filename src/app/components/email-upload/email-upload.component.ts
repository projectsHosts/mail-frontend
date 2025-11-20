import { Component, EventEmitter, Output } from '@angular/core';
import { EmailService } from '../../services/email.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-email-upload',
    standalone: true,
  templateUrl: './email-upload.component.html',
  styleUrls: ['./email-upload.component.css'],
   imports: [FormsModule,CommonModule]
})
export class EmailUploadComponent {
  @Output() uploadSuccess = new EventEmitter<void>();

  formData = {
    file: null as File | null,
    name: '',
    subject: '',
    body: '',
    delaySeconds: 2
  };

  uploading = false;
  message = '';
  messageClass = '';
  showTemplates = false;
  attachmentFile: File | null = null;

    templates = [
  {
    title: 'Welcome Message',
    text:
      'Hello,\n\nWelcome to our service! We are excited to have you onboard.\n\nBest Regards,\nTeam'
  },
  {
    title: 'Offer Email',
    text:
      'Hello,\n\nHere’s an exclusive offer just for you! Don’t miss out on this limited-time opportunity.\n\nThanks,\nTeam'
  },
  {
    title: 'Follow-up Reminder',
    text:
      'Hi,\n\nJust following up on my previous email. Please let me know if you have any questions.\n\nRegards,\nTeam'
  }
];

  constructor(private emailService: EmailService, private auth:AuthService ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.formData.file = file;
    }
  }

  onSubmit(): void {
    if (!this.formData.file) {
      this.showMessage('Please select a file', 'alert-danger');
      return;
    }

    this.uploading = true;
    this.message = '';

    const formData = new FormData();
    formData.append('file', this.formData.file);
    formData.append('name', this.formData.name);
    formData.append('subject', this.formData.subject);
    formData.append('body', this.formData.body);
    formData.append('delaySeconds', this.formData.delaySeconds.toString());

    const userEmail = this.auth.getUserEmail(); 
  if (userEmail) {
  formData.append('getCreatedBy', userEmail);  
} else {
  // optional: handle case jab userEmail null ho
  console.warn('User email not found, not sending getCreatedBy');
}

// IMPORTANT: append attachment only if present
if (this.attachmentFile) {
  formData.append('attachment', this.attachmentFile, this.attachmentFile.name);
}

// DEBUG: log FormData entries
for (const pair of (formData as any).entries()) {
  console.log('FormData:', pair[0], pair[1]);
}

    // formData.append('getCreatedBy', this.auth.getUserEmail()?? '');

    this.emailService.uploadCampaign(formData).subscribe({
  next: (response: any) => {
    this.uploading = false;
     // Extract message properly
    const successMessage =
      response?.message ||       
      response?.status ||       
      'Campaign created successfully!'; // default fallback

       this.showMessage(successMessage, 'alert-success');
    // this.showMessage(response || 'Campaign created successfully!', 'alert-success');
    this.resetForm();
    this.uploadSuccess.emit();
  },
  error: (error) => {
    this.uploading = false;

    const errorMessage =
      error?.error?.message ||
      error?.error ||
      error?.message ||
      JSON.stringify(error);

    this.showMessage('Error: ' + errorMessage, 'alert-danger');
  }
});
  }

  private showMessage(msg: string, cssClass: string): void {
  this.message = msg;

  this.messageClass = cssClass === 'alert-success'
    ? 'message-success'
    : 'message-error';

  setTimeout(() => {
    this.message = '';
  }, 7000);
}


  private resetForm(): void {
    this.formData = {
      file: null,
      name: '',
      subject: '',
      body: '',
      delaySeconds: 2
    };
  }

  // ⭐ star icon click -> show/hide dropdown
  toggleTemplates(): void {
    this.showTemplates = !this.showTemplates;
  }

  // ⭐ template click -> body fill
  applyTemplate(template: { title: string; text: string }): void {
    // pura replace:
    this.formData.body = template.text;

    // agar append karna ho:
    // this.formData.body = (this.formData.body || '') + '\n\n' + template.text;

    this.showTemplates = false;
  }


//   removeFile(): void {
//   this.formData.file = null;
// }


// new handler
onAttachmentSelected(event: any): void {
  const f = event.target.files?.[0];
  if (!f) {
    this.attachmentFile = null;
    return;
  }
// validate size (<= 5MB) and type
  const allowed = ['application/pdf', 'application/msword',
                   'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const maxSize = 5 * 1024 * 1024;

  if (f.size > maxSize) {
    this.showMessage('Attachment too large. Max 5 MB allowed', 'alert-danger');
    (event.target as HTMLInputElement).value = '';
    return;
  }

  // sometimes mime-type may be missing, but we'll still accept common extensions
  const name = f.name.toLowerCase();
  const extOk = name.endsWith('.pdf') || name.endsWith('.doc') || name.endsWith('.docx');
  if (!allowed.includes(f.type) && !extOk) {
    this.showMessage('Only PDF / DOC / DOCX allowed for attachment', 'alert-danger');
    (event.target as HTMLInputElement).value = '';
    return;
  }

  this.attachmentFile = f;
}

removeAttachment(): void {
  this.attachmentFile = null;
  const el = document.getElementById('attachInput') as HTMLInputElement | null;
  if (el) el.value = '';
}


}