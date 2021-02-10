import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ServerConnection } from 'jema';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private token: string;
  private serverConnection: ServerConnection;
  public appState = new BehaviorSubject<any>({ state: 'Unknown' });
  public teamLeadFeatures = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  setAppState(state: any): void {
    this.appState.next(state);
  }

  enableTeamLeadFeatures(flag: boolean) {
    this.teamLeadFeatures.next(flag);
  }

  getToken(): string {
    return this.token;
  }

  saveToken(token: string) {
    this.token = token;
  }

  getBackendUrl(): string {
    if (environment.backend !== '') {
      return environment.backend;
    } else {
      return localStorage.getItem('backend');
    }
  }

  saveBackendIpAddress(ip: string) {
    localStorage.setItem('backend', ip);
  }

  getServerConnection(): ServerConnection {
    return this.serverConnection;
  }

  setupServerConnection() {
    this.serverConnection = new ServerConnection(this.getBackendUrl(), this.getToken());
  }

  connect() {
    this.serverConnection.connect();
  }

}
