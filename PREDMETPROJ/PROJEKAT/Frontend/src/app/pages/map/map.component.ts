import { ConstantPool } from '@angular/compiler';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { Map, featureFilter, Marker, Popup } from 'maplibre-gl';
import { ToastrService } from 'ngx-toastr';
import { ActiveOrder } from 'src/app/shared/models/order';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
map: Map | undefined;
orders!: ActiveOrder[];
token: any;
userId: any;

@ViewChild('map')
private mapContainer!: ElementRef<HTMLElement>;

constructor(private authService: AuthService, private orderService: OrderService, private toastr: ToastrService) { }

ngOnInit(): void {
  
}

ngAfterViewInit() {
  const initialState = { lng: 19.833549, lat: 45.267136, zoom: 14 };

  this.map = new Map({
    container: this.mapContainer.nativeElement,
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=Hmji94E0Izv9YAukXyVb`,
    center: [initialState.lng, initialState.lat],
    zoom: initialState.zoom
  });

  this.token = localStorage.getItem('token');
    this.userId = this.authService.getUserId(this.token);
    this.orderService.getAllUnclamedOrders(this.userId).subscribe(
      data=>{
        this.orders = data as ActiveOrder[];
        for(let key in this.orders) {
          console.log("key: " + key);
          let child = this.orders[key];
          const address = child.address;
          
          this.orderService.getLatLon(child.address).subscribe(
            data2=>{
              const dat = JSON.stringify(data2);
              console.log(JSON.parse(dat));
              let vv = JSON.parse(dat);
              let latMar = vv['features']['0']['properties']['lat'] as number;
              let lonMar = vv['features']['0']['properties']['lon'] as number;

              let marker = new Marker({color: "#FF0000"})
                .setLngLat([lonMar,latMar])
                .setPopup(new Popup().setHTML('<a href="/home/confirm/' + child.id + '">First Component</a>'))
                .addTo(this.map!);
              
                
               marker.togglePopup();
            }
          );
        }
      }, error =>{
        this.toastr.error("Failed to get any data", 'Error!' , {
          timeOut: 3000,
          closeButton: true,
        });  
      }
    );

}

clickedPop(){
  console.log('USPEEEEH')
}

ngOnDestroy() {
  this.map?.remove();
}

}
