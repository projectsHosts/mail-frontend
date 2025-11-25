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

//     templates = [
//   {
//     title: 'Welcome Message',
//     text:
//       'Hello,\n\nWelcome to our service! We are excited to have you onboard.\n\nBest Regards,\nTeam'
//   },
//   {
//     title: 'Offer Email',
//     text:
//       'Hello,\n\nHere’s an exclusive offer just for you! Don’t miss out on this limited-time opportunity.\n\nThanks,\nTeam'
//   },
//   {
//     title: 'Follow-up Reminder',
//     text:
//       'Hi,\n\nJust following up on my previous email. Please let me know if you have any questions.\n\nRegards,\nTeam'
//   }
// ];

 templates = [
  {
    title: 'Job Application Email',
    subject: 'Application for [Position Name] - [Your Name]',
    text: `Dear Hiring Manager,

I am writing to express my strong interest in the [Position Name] position at [Company Name], as advertised on [Job Portal/Company Website]. With my background in [Your Field/Domain] and passion for [Relevant Skills/Industry], I believe I would be a valuable addition to your team.

I have [X years/months] of experience in [Relevant Experience], where I have developed strong skills in [Key Skills]. My academic background includes [Your Degree] from [Your University], where I gained comprehensive knowledge in [Relevant Subjects].

I am particularly drawn to [Company Name] because of [Specific reason - company values/projects/culture]. I am confident that my skills in [Relevant Skills] align well with the requirements of this role.

I have attached my resume for your review. I would welcome the opportunity to discuss how my qualifications match your needs.

Thank you for considering my application. I look forward to hearing from you.

Best regards,
[Your Full Name]
[Phone Number]
[Email Address]
[LinkedIn Profile (optional)]`
  },
  
  {
    title: 'Internship Application Email',
    subject: 'Application for [Internship Position] - [Your Name]',
    text: `Dear [Hiring Manager's Name/Hiring Team],

I hope this email finds you well. I am [Your Name], a [Year] year student pursuing [Your Degree] from [Your University/College]. I am writing to apply for the [Internship Position] at [Company Name].

I am deeply interested in [Field/Domain], and I have been following [Company Name]'s work in [Specific Area]. Your recent [Project/Initiative] particularly caught my attention, and I would be thrilled to contribute to such innovative work.

During my academic journey, I have:
- Completed coursework in [Relevant Subjects]
- Worked on projects involving [Relevant Skills/Technologies]
- Developed proficiency in [Programming Languages/Tools/Skills]

I am eager to apply my theoretical knowledge in a practical setting and learn from your experienced team. I am available for an internship starting from [Start Date] for a duration of [Time Period].

Please find my resume attached for your consideration. I would be grateful for the opportunity to discuss how I can contribute to your team.

Thank you for your time and consideration.

Warm regards,
[Your Full Name]
[Phone Number]
[Email Address]
[LinkedIn Profile (optional)]`
  },
  
  {
    title: 'Follow-up Email After Application',
    subject: 'Following up on my application for [Position Name]',
    text: `Dear [Hiring Manager's Name],

I hope this message finds you well. I am writing to follow up on my application for the [Position Name] position that I submitted on [Date].

I remain very interested in this opportunity and would welcome the chance to discuss how my skills and experience align with [Company Name]'s needs. I am particularly excited about [Specific aspect of the role/company].

If there is any additional information I can provide to support my application, please don't hesitate to let me know.

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,
[Your Full Name]
[Phone Number]
[Email Address]`
  },
  
  {
    title: 'Thank You Email After Interview',
    subject: 'Thank you for the interview opportunity - [Position Name]',
    text: `Dear [Interviewer's Name],

Thank you for taking the time to meet with me on [Date] to discuss the [Position Name] role at [Company Name]. I truly appreciated the opportunity to learn more about the team and the exciting projects you're working on.

Our conversation reinforced my enthusiasm for this position. I am particularly excited about [Specific topic discussed in interview], and I believe my experience in [Relevant Skill/Experience] would allow me to make meaningful contributions to your team.

Please feel free to reach out if you need any additional information from my side. I look forward to the possibility of working together.

Thank you once again for your time and consideration.

Best regards,
[Your Full Name]
[Phone Number]
[Email Address]`
  },
  
  {
    title: 'Internship Offer Acceptance Email',
    subject: 'Acceptance of Internship Offer - [Your Name]',
    text: `Dear [Hiring Manager's Name],

I am delighted to accept the internship offer for the position of [Internship Position] at [Company Name]. Thank you for this wonderful opportunity.

I confirm my acceptance of the terms discussed:
- Start Date: [Date]
- Duration: [Time Period]
- Stipend: [Amount, if applicable]

I am excited to join your team and contribute to [Specific Project/Department]. Please let me know if there are any documents or formalities I need to complete before my start date.

I look forward to working with you and learning from the talented team at [Company Name].

Thank you once again for this opportunity.

Best regards,
[Your Full Name]
[Phone Number]
[Email Address]`
  },
  
  {
    title: 'Job Offer Acceptance Email',
    subject: 'Acceptance of Job Offer - [Position Name] - [Your Name]',
    text: `Dear [Hiring Manager's Name],

I am writing to formally accept your offer for the position of [Position Name] at [Company Name]. I am thrilled to join your team and contribute to the company's success.

As per our discussion, I confirm the following details:
- Position: [Job Title]
- Start Date: [Date]
- Annual Salary: [Amount]
- Reporting to: [Manager's Name]

I am looking forward to bringing my skills and enthusiasm to [Company Name] and working alongside such a talented team. Please let me know the next steps and any paperwork I need to complete prior to my start date.

Thank you for this incredible opportunity. I am excited to begin this new chapter.

Best regards,
[Your Full Name]
[Phone Number]
[Email Address]`
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