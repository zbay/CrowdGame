import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-gamebox',
  templateUrl: './gamebox.component.html',
  styleUrls: ['./gamebox.component.css']
})
export class GameboxComponent implements OnInit {
  @Input() game;
  @Input() user_id;
  @Output() deleteEmitter = new EventEmitter();
  @Output() joinEmitter = new EventEmitter();
  @Output() leaveEmitter = new EventEmitter();
  @Output() editEmitter = new EventEmitter();
  @Output() closeEmitter = new EventEmitter();
  @Output() openEmitter = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onDelete(){
    this.deleteEmitter.emit(this.game._id);
  }

  onJoin(){
    this.joinEmitter.emit(this.game._id);
  }

  onLeave(){
    this.leaveEmitter.emit(this.game._id);
  }

  onClose(){
    this.closeEmitter.emit(this.game._id);
  }

  onOpen(){
    this.openEmitter.emit(this.game._id);
  }

  onEdit(){
    this.game.date = this.padDatesWithZeroes(this.game.date);
    console.log(this.game.date);
    this.game.datetime = new Date(this.game.date + "T" + this.game.time);
    this.editEmitter.emit(this.game);
  }

  padDatesWithZeroes(date){
    let firstDashIndex = date.indexOf("-");
    let temp = date.slice(firstDashIndex+1);
    if(temp.indexOf("-") === 1){ // tack on a zero to the month, if necessary
      date = date.slice(0, firstDashIndex+1) + "0" + date.slice(firstDashIndex+1);
    }
    temp = temp.slice(temp.indexOf("-")+1);
    if(temp.length === 1){ // tack on a zero to the day, if necessary
      date = date.slice(0, date.length-1) + "0" + date.charAt(date.length-1);
    }
    return date
  }

}
