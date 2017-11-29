import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Input() myGamesTab = false;
  @Output() searchEmitter = new EventEmitter();
  @Output() resetEmitter = new EventEmitter();
  searchTerm: string = "";
  category: string = "Any";
  //justMine: boolean = false;
  justFriends: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  search(){
    this.searchEmitter.emit({searchTerm: this.searchTerm, category: this.category, justMine: this.myGamesTab, justFriends: this.justFriends});
  }

  resetSearch(){
    this.resetEmitter.emit();
  }

  toggleFriends(){
    this.justFriends = !this.justFriends;
  }

}