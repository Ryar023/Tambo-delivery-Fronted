import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CheckoutData {
  // Dirección de entrega
  deliveryAddress?: {
    id?: number;
    name: string;
    address: string;
    district: string;
    reference?: string;
    latitude?: number;
    longitude?: number;
  };
  
  // Método de pago
  paymentMethod?: 'YAPE' | 'TRANSFERENCIA' | 'PAYPAL' | 'TARJETA_CREDITO' | 'TARJETA_DEBITO' | 'EFECTIVO';
  
  // Información de tarjeta (si aplica)
  cardInfo?: {
    cardNumber: string;
    cardHolderName: string;
    expiryDate: string;
    cvv: string;
  };
  
  // Tipo de comprobante
  receiptType?: 'BOLETA' | 'FACTURA';
  
  // Información de facturación (si es FACTURA)
  billingInfo?: {
    docType: string;
    docNumber: string;
    businessName: string;
    ruc: string;
  };
  
  // Método de entrega
  deliveryMethod?: 'STORE' | 'DELIVERY';
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private checkoutDataSubject = new BehaviorSubject<CheckoutData>({});
  public checkoutData$ = this.checkoutDataSubject.asObservable();

  constructor() {}

  /**
   * Obtiene los datos actuales del checkout
   */
  getCheckoutData(): CheckoutData {
    return this.checkoutDataSubject.value;
  }

  /**
   * Actualiza los datos del checkout
   */
  updateCheckoutData(data: Partial<CheckoutData>): void {
    const currentData = this.checkoutDataSubject.value;
    this.checkoutDataSubject.next({ ...currentData, ...data });
  }

  /**
   * Limpia todos los datos del checkout
   */
  clearCheckoutData(): void {
    this.checkoutDataSubject.next({});
  }

  /**
   * Verifica si se ha seleccionado una dirección
   */
  hasDeliveryAddress(): boolean {
    return !!this.checkoutDataSubject.value.deliveryAddress;
  }

  /**
   * Verifica si se ha seleccionado un método de pago
   */
  hasPaymentMethod(): boolean {
    return !!this.checkoutDataSubject.value.paymentMethod;
  }

  /**
   * Verifica si todos los datos necesarios están completos
   */
  isCheckoutComplete(): boolean {
    const data = this.checkoutDataSubject.value;
    return !!(
      data.deliveryAddress &&
      data.paymentMethod &&
      data.deliveryMethod
    );
  }
}
