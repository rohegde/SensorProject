import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { AlertController } from 'ionic-angular';

import { DeviceMotion } from 'ionic-native';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  acc = undefined;
  handle = undefined;
  started = false;
  posts = "";
  serverIP = undefined;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: Http) {
    this.http.get('config.json').map(res => res.json()).subscribe(data => {
      this.serverIP = data.serverIP;
    });
  }

  registerAccSensor(event) {
    // Build the post string from an object
    console.log("register post inside");
    var post_data = {
      "type": "Accelerometer Sensor",
      "name": "Accelerometer Sensor",
      "frequency": "500",
      "UID": "AccX",
      "unit": "m/s^2"
    };

    var body = JSON.stringify(post_data);
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');


    console.log("before http");
    this.http
      .post('http://' + this.serverIP + ':8080/api/sensors', body, {
        headers: headers
      })
      .map(response => response.json())
      .subscribe(
        response => {
          console.log(JSON.stringify(response)),
            this.posts = JSON.stringify(response),
            (err) => {
              console.log('Errorr: ' + err)
            },
            () => console.log('Registration Complete')
        }
      );
  }

  clickedAlert(event) {
    event.preventDefault();

    if (this.started) {
      this.started = false;
      clearInterval(this.handle);
      console.log("Stopping!");
    } else {

      this.started = true;
      this.handle = setInterval(() => {
        // Get the device current acceleration
        DeviceMotion.getCurrentAcceleration().then(
          (acceleration) => {
            console.log("acc" + acceleration.x);
            this.acc = acceleration.x;

            this.sendAccToServer(acceleration.x);

          },
          (error: any) => {
            console.log(error)
          }
        );
      }, 1000);
      console.log("Starting!");
    }

  }

  sendAccToServer(acc: number) {
    var body = JSON.stringify({
      "lastReading": {
        "value": acc,
        "timestamp": Date.now()
      }
    });
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');


    this.http
      .post('http://' + this.serverIP + ':8080/api/sensors/AccX/sensorReadings/latest', body, {
        headers: headers
      })
      .map(response => response.json())
      .subscribe(
        response => {
          console.log(JSON.stringify(response)),
            this.posts = JSON.stringify(response),
            (err) => {
              console.log('Errorr: ' + err)
            },
            () => console.log(this.posts + ' Starting the Acc Complete')
        }
      );

  }


}
