import type { PaymentMethod, PaymentIntent, CardFormData } from '../types';

const detectCardBrand = (cardNumber: string): string => {
   if (cardNumber.startsWith('4')) return 'Visa';
   if (cardNumber.startsWith('5')) return 'Mastercard';
   if (cardNumber.startsWith('34') || cardNumber.startsWith('37')) return 'Amex';
   return 'Unknown';
};

export const paymentService = {
   async getPaymentMethods(): Promise<PaymentMethod[]> {
      return new Promise((resolve) =>
         setTimeout(() => resolve([
            { id: 'pm_mock_visa', type: 'card', last4: '4242', brand: 'Visa', expiryMonth: 12, expiryYear: 2026, isDefault: true }
         ]), 500)
      );
   },

   async addPaymentMethod(cardData: CardFormData): Promise<PaymentMethod> {
      return new Promise((resolve) => {
         setTimeout(() => {
            const cleanNumber = cardData.cardNumber.replace(/\s/g, '');
            const [month, year] = cardData.expiry.split('/');
            resolve({
               id: `pm_${Date.now()}`,
               type: 'card',
               last4: cleanNumber.slice(-4),
               brand: detectCardBrand(cleanNumber),
               expiryMonth: parseInt(month),
               expiryYear: parseInt('20' + year),
               isDefault: false
            });
         }, 500);
      });
   },

   async deletePaymentMethod(paymentMethodId: string): Promise<void> {
      return new Promise((resolve) =>
         setTimeout(() => resolve(), 500)
      );
   },

   async createPaymentIntent(
      amount: number,
      appointmentId: string
   ): Promise<PaymentIntent> {
      return  new Promise((resolve) => {
         setTimeout(() => {
            resolve({
               id: `pi_${Date.now()}`,
               amount: amount * 100, 
               currency: 'usd',
               status: 'pending',
               clientSecret: 'pi_secret_' + Date.now()
            });
         }, 800);
      });
   },

   async processPayment(
      paymentIntentId: string,
      paymentMethodId: string,
      appointmentId: string
   ): Promise<{ success: boolean; appointmentId: string }> {
      return new Promise((resolve) => {
         setTimeout(() => {
            resolve({
               success: true,
               appointmentId
            });
         }, 2000);
      });
   }
};