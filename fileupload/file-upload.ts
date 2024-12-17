import { Component } from "@angular/core";
import { FileUploadService } from "./file-upload.service";

@Component({
  selector: "app-upload-documents",
  templateUrl: "./upload-documents.component.html",
  styleUrls: ["./upload-documents.component.css"],
})
export class UploadDocumentsComponent {
  displayedColumns: string[] = ["docType", "upload", "uploaded", "notes"];

  documents = [
    {
      docType: "Last 3 Months Of Business Bank Statements (digitally)",
      uploadedFiles: ["Bank statements_Aug2024.pdf"],
      notes: "",
    },
    {
      docType: "Proof tax lien has been satisfied",
      uploadedFiles: [],
      notes: "",
    },
    {
      docType: "Certification of Formation/Article of Organization",
      uploadedFiles: [],
      notes: "",
    },
    {
      docType: "XXXXXXX",
      uploadedFiles: [],
      notes: "",
    },
  ];

  constructor(private fileUploadService: FileUploadService) {}

  // Handle File Upload
  onFileUpload(event: Event, element: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log("Uploading File:", file.name);

      // Call service to upload the file
      this.fileUploadService.uploadFile(file).subscribe({
        next: (response) => {
          console.log("Upload Success:", response);

          // Add file to the uploadedFiles array
          element.uploadedFiles.push(file.name);
          alert(`File "${file.name}" uploaded successfully!`);
        },
        error: (err) => {
          console.error("Upload Failed:", err);
          alert("File upload failed. Please try again.");
        },
      });
    }
  }

  finishUpload() {
    console.log("Upload process finished.");
    alert("All documents uploaded successfully!");
  }

  goBack() {
    console.log("Navigating back to Dashboard.");
    alert("Returning to Dashboard...");
  }
}
