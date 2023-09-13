import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Article } from '../models/article';
import { CancelOrder, CreateOrder, PaymentPrice } from '../models/order';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
newOrder!: CreateOrder;
baseUrl = environment.baseUrl;
token: any;
newOrderPom: CreateOrder = {
  comment: "",
  address: "",
  sellerId: -1,
  userId: -1,
  item: {
    articleId: -1,
    quantity: -1
  },
};

clientId = "AS2RSszuxVXWWqMmRgSiCQ1deeV9GrnCQYMe9v1W7RfynvTAlkKMjOi486om1qlHgR2lc24tG055";
sellerPayerId = "draganicj62@gmail.com";
jwt: any;
orderId: any;


constructor(private http: HttpClient,
            private authService: AuthService) {
              this.jwt = this.getAuthAssertionValue(this.clientId, this.sellerPayerId);
             }

setNewOrderPom(orderSource:CreateOrder){
  this.newOrderPom = orderSource;
}

getAuthAssertionValue(clientId: any, sellerPayerId: any) {
  const header = {
      "alg": "none"
  };
  const encodedHeader = this.base64url(header);
  const payload = {
      "iss": clientId,
      "payer_id": sellerPayerId
  };
  const encodedPayload = this.base64url(payload);
  return `${encodedHeader}.${encodedPayload}.`;
}

base64url(json: any) {
  return btoa(JSON.stringify(json))
      .replace(/=+$/, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
}

refundOrder(){
  
  
  console.log(this.jwt);

  return this.http.post('https://api-m.sandbox.paypal.com/v2/payments/captures/9KD60231A22096811/refund', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer A21AAI4BgwAtZQWTTOJkkLK8aMJlehdPChE0sqxV_jm9vvCwVZ-OWS9k4DAJm2uNnaktTraZfHjfo4xLaE5_Pni8fhKYkcI8w',
            'PayPal-Request-Id': '123e4567-e89b-12d3-a456-426655440020',
            'PayPal-Auth-Assertion': 'eyJhbGciOiJub25lIn0.eyJpc3MiOiJjbGllbnRfaWQiLCJlbWFpbCI6Im15LWVtYWlsQGV4YW1wbGUuY29tIn0.',
            //'X-Requested-With': 'XMLHttpRequest'
        },
        //body: JSON.stringify({ "amount": { "value": "10.00", "currency_code": "USD" }, "invoice_id": "INVOICE-123", "note_to_payer": "DefectiveProduct", "payment_instruction": { "platform_fees": [ { "amount": { "currency_code": "USD", "value": "1.00" } } ] } })
    });
}

getLatLon(address:string){
  return this.http.get(`https://cors-anywhere.herokuapp.com/api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=78f9813e220a4b578e84014392a073f3`)
}

getAllUnclamedOrders(id: number){
  return this.http.get(this.baseUrl + '/v1/order/activeUnclamed/' + id, this.getHttpHeader());
}

getPrices(newOrder:CreateOrder){
  return this.http.get(this.baseUrl + '/v1/order/getPrice', this.getHttpHeader());
}

getNewOrderPom() : CreateOrder{
  return this.newOrderPom;
}

getAllOrders(){
  return this.http.get(this.baseUrl + '/v1/order', this.getHttpHeader());
}

getOrderHistory(id: number){
  return this.http.get(this.baseUrl + '/v1/order/history/' + id, this.getHttpHeader());
}

getActiveOrder(id: number){
  return this.http.get(this.baseUrl + '/v1/order/active/' + id, this.getHttpHeader());
}

getActiveOrderUnclamed(id: number){
  return this.http.get(this.baseUrl + '/v1/order/activeOrderUnclamed/' + id, this.getHttpHeader());
}

getOrderQuanity(order: CreateOrder){
  this.token = localStorage.getItem('token');
  order.userId = this.authService.getUserId(this.token);
  return this.http.post(this.baseUrl + '/v1/order/getQuanityOrder', order, this.getHttpHeader());
}

createOrderPayPal(order: CreateOrder){
  
  this.token = localStorage.getItem('token');
  order.userId = this.authService.getUserId(this.token);
  return this.http.post(this.baseUrl + '/v1/order/createPayPal',order ,this.getHttpHeader());
}

updateOrderUnclamed(id: number){
  return this.http.get(this.baseUrl + '/v1/order/unclamedConfirm/' + id, this.getHttpHeader());
}

createOrder(order: CreateOrder){
  
  this.token = localStorage.getItem('token');
  order.userId = this.authService.getUserId(this.token);
  return this.http.post(this.baseUrl + '/v1/order/create',order ,this.getHttpHeader());
}

cancelOrder(cancelOrder: CancelOrder){
  return this.http.patch(this.baseUrl + '/v1/order/cancel', cancelOrder ,this.getHttpHeader());
}

getHttpHeader(): { headers: HttpHeaders; }{
  const httpOptions = {
    headers: new HttpHeaders({
      Accept: "application/json",
      Authorization: 'Bearer '+ localStorage.getItem('token')
    })
  };
  return httpOptions;
}

}
