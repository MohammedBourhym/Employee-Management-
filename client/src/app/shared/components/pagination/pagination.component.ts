import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';

interface PageEvent {
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [PaginatorModule, CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  first: number = 0;
  rows: number = 10;
  @Input()  rowsPerPage :number =10
  @Input() totalRecords = 0;
  @Output() pageChange = new EventEmitter<PageEvent>();

  ngOnInit(): void {
    // Emit an initial page event if necessary
    this.pageChange.emit({ first: this.first, rows: this.rows, page: 0, pageCount: Math.ceil(this.totalRecords / this.rows) });
  }

  onPageChange(event: PageEvent) {
    // Update local state with event data
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    // Emit the event to the parent component
    this.pageChange.emit(event);
  }
}
