import {Injectable, OnInit} from '@angular/core';
import {ParamMap, Router} from "@angular/router";

@Injectable()
export class MessageService {
  private _messageType: MessageType;
  private _message: string;

  constructor(
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      this.messageType = null;
      this.message = null;
    });
  }

  showInformation(message: string): void {
    this.showMessage(MessageType.INFORMATION, message);
  }

  showSuccess(message: string): void {
    this.showMessage(MessageType.SUCCESS, message);
  }

  showWarning(message: string): void {
    this.showMessage(MessageType.WARNING, message);
  }

  showError(message: string): void {
    this.showMessage(MessageType.ERROR, message);
  }

  get messageType(): MessageType {
    return this._messageType;
  }

  set messageType(value: MessageType) {
    this._messageType = value;
  }

  get message(): string {
    return this._message;
  }

  set message(value: string) {
    this._message = value;
  }

  showMessage(messageType: MessageType, message: string): void {
    this._messageType = messageType;
    this._message = message;
  }
}

export enum MessageType {
  INFORMATION,
  SUCCESS,
  WARNING,
  ERROR
}
