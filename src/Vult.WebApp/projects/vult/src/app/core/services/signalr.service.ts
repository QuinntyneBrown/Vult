// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Subject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { IngestionProgress, IngestionResult } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection?: HubConnection;
  private ingestionProgressSubject = new Subject<IngestionProgress>();
  private ingestionCompleteSubject = new Subject<IngestionResult>();
  private ingestionErrorSubject = new Subject<string>();

  public ingestionProgress$: Observable<IngestionProgress> = this.ingestionProgressSubject.asObservable();
  public ingestionComplete$: Observable<IngestionResult> = this.ingestionCompleteSubject.asObservable();
  public ingestionError$: Observable<string> = this.ingestionErrorSubject.asObservable();

  constructor(private authService: AuthService) {}

  public async startConnection(): Promise<void> {
    const token = this.authService.getAccessToken();

    if (!token) {
      console.warn('No access token available for SignalR connection');
      return;
    }

    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7266/hubs/ingestion', {
        accessTokenFactory: () => token
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('IngestionProgress', (data: IngestionProgress) => {
      this.ingestionProgressSubject.next(data);
    });

    this.hubConnection.on('IngestionComplete', (result: IngestionResult) => {
      this.ingestionCompleteSubject.next(result);
    });

    this.hubConnection.on('IngestionError', (error: string) => {
      this.ingestionErrorSubject.next(error);
    });

    try {
      await this.hubConnection.start();
      console.log('SignalR connection established');
    } catch (err) {
      console.error('Error while starting SignalR connection: ', err);
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  public async stopConnection(): Promise<void> {
    if (this.hubConnection) {
      try {
        await this.hubConnection.stop();
        console.log('SignalR connection stopped');
      } catch (err) {
        console.error('Error while stopping SignalR connection: ', err);
      }
    }
  }

  public isConnected(): boolean {
    return this.hubConnection?.state === 'Connected';
  }
}
