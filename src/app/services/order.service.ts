import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/app.constants';

// ==================== INTERFACES PARA VALIDACIÓN DE CARRITO ====================

/**
 * Request para validar el carrito (debe coincidir con CartValidationRequest.java)
 */
export interface CartValidationRequest {
  items: CartItemValidationRequest[];
}

export interface CartItemValidationRequest {
  productId: string; // UUID en el backend
  quantity: number;
  expectedPrice: number; // Precio esperado por el cliente
}

/**
 * Response de validación del carrito (debe coincidir con CartValidationResponse.java)
 */
export interface CartValidationResponse {
  valid: boolean; // true si el carrito es válido
  message: string; // Mensaje general de la validación
  items: CartItemValidation[]; // Detalles de cada producto
  totalAmount: number; // Monto total calculado en el backend
}

export interface CartItemValidation {
  productId: string;
  productName: string;
  available: boolean; // true si está disponible
  stockSufficient: boolean; // true si hay suficiente stock
  availableStock: number; // Stock actual disponible
  currentPrice: number; // Precio actual en el backend
  priceChanged: boolean; // true si el precio cambió
  errorMessage?: string; // Mensaje de error específico
}

// ==================== INTERFACES PARA ÓRDENES ====================

export interface OrderItemRequest {
  productId: string;
  quantity: number;
  itemPrice: number;
}

export interface OrderRequest {
  orderDate: Date;
  latitude: number;
  longitude: number;
  orderItemRequests: OrderItemRequest[];
  deliveryMethod: 'PICKUP' | 'DELIVERY';
  totalAmount: number;
  discount: number;
  paymentMethod: 'CASH' | 'CARD' | 'PAYPAL' | 'YAPE' | 'PLIN';
  expectedDeliveryDate: Date;
  receiptType: 'BOLETA' | 'FACTURA';
  docType: string;
  docNumber: number;
  billingAddress?: string;
  businessName?: string;
}

export interface OrderResponse {
  orderId: string;
  paymentMethod: string;
}

export interface OrderDetails {
  id: string;
  orderDate: Date;
  latitude: number;
  longitude: number;
  totalAmount: number;
  orderStatus: string;
  shipmentNumber: string;
  expectedDeliveryDate: Date;
  orderItemList: OrderItemDetail[];
}

export interface OrderItemDetail {
  id: string;
  product: any;
  quantity: number;
  itemPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ORDERS.CREATE}`;

  constructor(private http: HttpClient) {}

  /**
   * Valida el carrito antes de proceder con la compra
   * Endpoint público - no requiere autenticación
   */
  validateCart(request: CartValidationRequest): Observable<CartValidationResponse> {
    return this.http.post<CartValidationResponse>(
      `${this.apiUrl}/validate-cart`,
      request
    );
  }

  /**
   * Crea una nueva orden
   */
  createOrder(orderRequest: OrderRequest): Observable<OrderResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<OrderResponse>(
      this.apiUrl,
      orderRequest,
      { headers }
    );
  }

  /**
   * Obtiene el historial de órdenes del usuario
   */
  getMyOrders(): Observable<OrderDetails[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<OrderDetails[]>(
      `${this.apiUrl}/my-orders`,
      { headers }
    );
  }

  /**
   * Obtiene el detalle de una orden específica
   */
  getOrderById(orderId: string): Observable<OrderDetails> {
    const headers = this.getAuthHeaders();
    return this.http.get<OrderDetails>(
      `${this.apiUrl}/${orderId}`,
      { headers }
    );
  }

  /**
   * Descarga la boleta en PDF
   */
  downloadBoleta(orderId: string): Observable<Blob> {
    const headers = this.getAuthHeaders();
    return this.http.get(
      `${this.apiUrl}/${orderId}/boleta`,
      { 
        headers,
        responseType: 'blob'
      }
    );
  }

  /**
   * Descarga la factura en PDF
   */
  downloadFactura(orderId: string): Observable<Blob> {
    const headers = this.getAuthHeaders();
    return this.http.get(
      `${this.apiUrl}/${orderId}/factura`,
      { 
        headers,
        responseType: 'blob'
      }
    );
  }

  /**
   * Obtiene los headers de autenticación
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
