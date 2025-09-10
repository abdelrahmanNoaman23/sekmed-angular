import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard  implements OnChanges, OnInit{
 


  @Input() product: any;
  @Output() addProductToCart = new EventEmitter<void>(); 


  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
  }
  ngOnInit(){
    console.log("Child component initiailized")
  }

addToCart() {
  this.addProductToCart.emit();
  console.log("Hi from product card component");
}   



}
