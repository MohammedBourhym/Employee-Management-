import { Component, EventEmitter, Output } from '@angular/core';
import { FileService } from './file-service.service';

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [],
  templateUrl: './export.component.html',
  styleUrl: './export.component.css'
})
export class ExportComponent {
  
  @Output() close = new EventEmitter<void>();
  constructor(private fileService: FileService) {}
 onClose(){
  this.close.emit(); 
 }
  downloadTable(file : 'pdf' |'csv') {
    this.fileService.downloadTable(file).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      if(file=='pdf')
      a.download = 'employees.pdf';
      if(file=='csv')
      a.download = 'employees.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      this.close.emit();
    });
  }

}

