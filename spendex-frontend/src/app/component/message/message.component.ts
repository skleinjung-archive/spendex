import {MessageService, MessageType} from '../../service/message-service';

import {Component} from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {
  constructor(
    private messageService: MessageService
  ) {
  }

  getMessage(): string {
    return this.messageService.message;
  }

  getMessageType(): string {
    switch (this.messageService.messageType) {
      case MessageType.INFORMATION:
        return 'information';
      case MessageType.SUCCESS:
        return 'success';
      case MessageType.WARNING:
        return 'warning';
      case MessageType.ERROR:
        return 'error';
      default:
        return 'information';
    }
  }
}

