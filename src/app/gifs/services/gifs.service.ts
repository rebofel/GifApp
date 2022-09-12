import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

private apiKey: string = 'r6MIumQlXB0iic50g0BP6bL5emp4yhZo';
private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
private _historial: string[] = [];

public resultados: Gif[] = [];

get historial() {
  
  return [...this._historial];
}

constructor(private http: HttpClient) {

  this._historial = JSON.parse(localStorage.getItem('historial')!) || []; //Si no existe el historial, entonces es un arreglo vacio
  this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
}

buscarGifs( query:string = '' ) { //Que siempre tenga un valor (' ')
  query = query.trim().toLowerCase(); //Trim elimina espacios en blanco, toLowerCase convierte a minusculas
if(!this._historial.includes(query)){ //Si, en el historial, NO EXISTE, lo buscado
  this._historial.unshift( query ); //Entonces incluyo en el historial lo buscado 
  this._historial = this._historial.splice(0,10); //Corta el arreglo en 10 elementos
localStorage.setItem('historial', JSON.stringify(this._historial)); //Guarda en el local storage el historial

}

const parametrosApi = new HttpParams()
.set('api_key', this.apiKey)
.set('limit', '10')
.set('q', query);

//Retorna observable (Del HTTP Client de Angular) en vez de una promesa (Fetch API de JS)
this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, {params: parametrosApi})
.subscribe( (resp) => { 

console.log(resp.data);
this.resultados = resp.data;
localStorage.setItem('resultados', JSON.stringify(this.resultados));  //Guarda resultados en el Local Storage 
});

}

}