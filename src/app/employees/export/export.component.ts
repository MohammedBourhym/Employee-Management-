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
  downloadTable(type : 'json'|'csv') {
    this.fileService.downloadTable(type).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'table-data.json';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

}

