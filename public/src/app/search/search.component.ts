import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Output() searchEmitter = new EventEmitter();
  searchTerm: string = "";
  category: string = "";

  constructor() { }

  ngOnInit() {
  }

  search(){
    this.searchEmitter.emit({searchTerm: this.searchTerm, category: this.category});
  }

}