import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BackendService } from 'src/app/_shared/backend.service';
import { NetworkTester } from 'jema';

@Component({
  selector: 'app-server-selection',
  templateUrl: './server-selection.component.html',
  styleUrls: ['./server-selection.component.scss']
})
export class ServerSelectionComponent implements OnInit {

  public serverSelectionForm: FormGroup;
  tester = new NetworkTester();

  constructor(private service: BackendService) { }

  ngOnInit(): void {
    this.serverSelectionForm = new FormGroup({
      serverIp: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    });

    if (this.service.getBackendUrl() !== null) {
      this.service.setAppState({ state: 'ServerFound', connected: false });
    } else {
      const detectedServerName = location.hostname + (location.port ? ':' + location.port : '');
      const detectedProtocol = location.protocol;

      this.tester.ping(detectedProtocol + '//' + detectedServerName).subscribe(() => {
        this.serverSelectionForm.controls.serverIp.setValue(detectedServerName);
      });

    }

  }

  public hasError = (controlName: string, errorName: string) => {
    return this.serverSelectionForm.controls[controlName].hasError(errorName);
  }

  saveIpAddress(): void {
    let url = this.serverSelectionForm.value.serverIp;

    if (!url.startsWith('http:') && !url.startsWith('https:')) {
      url = location.protocol + '//' + url;
    }

    this.service.saveBackendIpAddress(url);
    this.service.setAppState({ state: 'ServerFound', connected: false });
  }


}
