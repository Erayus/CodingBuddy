import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_model/message';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};

  constructor(private userServ: UserService, private authServ: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages(){
    this.userServ.getMessageThread(this.authServ.decodedToken.nameid, this.recipientId)
      .subscribe(
        messages => {
          this.messages = messages.reverse();
          console.log(this.messages)
        },
        error => {
          this.alertify.error(error);
        }
      );
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userServ.sendMessage(this.authServ.decodedToken.nameid, this.newMessage)
      .subscribe( (message: Message) => {
      this.messages.push(message);
      this.newMessage.content = '';
    }, error => {this.alertify.error(error)});
  }

}
