import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { IngestionProgress, IngestionResult } from '../../../core/models';

/**
 * Fake SignalR service for testing purposes
 * Does not use actual WebSockets - simulates SignalR behavior with RxJS Subjects
 */
@Injectable({
  providedIn: 'root'
})
export class FakeSignalRService {
  private ingestionProgressSubject = new Subject<IngestionProgress>();
  private ingestionCompleteSubject = new Subject<IngestionResult>();
  private ingestionErrorSubject = new Subject<string>();
  private connected = false;

  public ingestionProgress$: Observable<IngestionProgress> = this.ingestionProgressSubject.asObservable();
  public ingestionComplete$: Observable<IngestionResult> = this.ingestionCompleteSubject.asObservable();
  public ingestionError$: Observable<string> = this.ingestionErrorSubject.asObservable();

  public async startConnection(): Promise<void> {
    console.log('FakeSignalRService: Connection started (no actual WebSocket)');
    this.connected = true;
    return Promise.resolve();
  }

  public async stopConnection(): Promise<void> {
    console.log('FakeSignalRService: Connection stopped');
    this.connected = false;
    return Promise.resolve();
  }

  public isConnected(): boolean {
    return this.connected;
  }

  // Test helper methods to simulate server events
  public simulateProgress(current: number, total: number, status: string): void {
    this.ingestionProgressSubject.next({ current, total, status });
  }

  public simulateComplete(result: IngestionResult): void {
    this.ingestionCompleteSubject.next(result);
  }

  public simulateError(error: string): void {
    this.ingestionErrorSubject.next(error);
  }
}
