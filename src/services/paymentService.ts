import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';
import { paymentAPI } from './api';
import type { 
  PaymentMethod, 
  SavedCard, 
  SaveCardRequest, 
  ProcessPaymentRequest,
  ProcessPaymentResponse 
} from '../types';

// Define PaymentIntent type
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
}

// Initialize Stripe - Export this to use the same instance everywhere
const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
if (!key) {
  console.error('⚠️ Stripe publishable key is not configured in .env file');
}

// Load Stripe with error handling
export const stripePromise = key ? loadStripe(key).catch((error) => {
  console.error('Failed to load Stripe.js:', error);
  console.warn('Make sure you have internet connection and Stripe key is correct');
  return null;
}) : Promise.resolve(null);

// Helper function to get Stripe instance
export const getStripe = () => {
  if (!stripePromise) {
    throw new Error('Stripe is not initialized');
  }
  return stripePromise;
};

// Helper function to detect card brand (can be used in future enhancements)
// const _detectCardBrand = (cardNumber: string): string => {
//    if (cardNumber.startsWith('4')) return 'Visa';
//    if (cardNumber.startsWith('5')) return 'Mastercard';
//    if (cardNumber.startsWith('34') || cardNumber.startsWith('37')) return 'Amex';
//    return 'Unknown';
// };

// Convert SavedCard from backend to PaymentMethod for UI
const mapSavedCardToPaymentMethod = (card: SavedCard): PaymentMethod => ({
  id: card.id,
  type: 'card',
  last4: card.last_four,
  brand: card.brand,
  expiryMonth: card.exp_month,
  expiryYear: card.exp_year,
  isDefault: card.is_default,
});

export const paymentService = {
   /**
    * Get all saved payment methods from backend
    */
   async getPaymentMethods(): Promise<PaymentMethod[]> {
      try {
        const response = await paymentAPI.listCards();
        const cards: SavedCard[] = response.data.data || response.data;
        return cards.map(mapSavedCardToPaymentMethod);
      } catch (error: any) {
        console.error('Failed to fetch payment methods:', error);
        // Return empty array if backend endpoint doesn't exist yet or CORS error
        if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
          console.warn('Backend endpoint /saved-cards not available yet. Using empty list.');
          return [];
        }
        return [];
      }
   },

   /**
    * Create a Stripe payment method and save it to backend
    */
   async addPaymentMethod(cardElement: any): Promise<PaymentMethod> {
      try {
        const stripe = await getStripe();
        if (!stripe) {
          throw new Error('Stripe failed to initialize');
        }

        // Create payment method with Stripe
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

        if (error) {
          throw new Error(error.message);
        }

        if (!paymentMethod) {
          throw new Error('Failed to create payment method');
        }

        // Extract card details
        const card = paymentMethod.card!;
        
        // Save to backend
        const saveRequest: SaveCardRequest = {
          provider_token: paymentMethod.id,
          brand: card.brand || 'Unknown',
          last_four: card.last4 || '0000',
          exp_month: card.exp_month,
          exp_year: card.exp_year,
          is_default: false,
        };

        console.log('💳 Saving card to backend:', saveRequest);
        const response = await paymentAPI.saveCard(saveRequest);
        const savedCard: SavedCard = response.data.data || response.data;
        
        return mapSavedCardToPaymentMethod(savedCard);
      } catch (error: any) {
        console.error('Failed to add payment method:', error);
        
        // Handle specific errors
        if (error.response?.status === 401) {
          throw new Error('Please login to save your card');
        }
        
        if (error.code === 'ERR_NETWORK') {
          throw new Error('Network error - Please check your connection');
        }
        
        const errorMsg = error.response?.data?.message || error.message || 'Failed to add payment method';
        throw new Error(errorMsg);
      }
   },

   /**
    * Delete a saved payment method
    */
   async deletePaymentMethod(paymentMethodId: string): Promise<void> {
      try {
        await paymentAPI.deleteCard(paymentMethodId);
      } catch (error) {
        console.error('Failed to delete payment method:', error);
        throw new Error('Failed to delete payment method');
      }
   },

   /**
    * Set a card as default payment method
    */
   async setDefaultPaymentMethod(paymentMethodId: string): Promise<void> {
      try {
        await paymentAPI.setDefaultCard(paymentMethodId);
      } catch (error) {
        console.error('Failed to set default payment method:', error);
        throw new Error('Failed to set default payment method');
      }
   },

   async createPaymentIntent(
      amount: number,
      _appointmentId: string
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

   /**
    * Process payment for a booking
    */
   async processPayment(
      bookingId: string,
      paymentMethodId?: string
   ): Promise<ProcessPaymentResponse> {
      try {
        const request: ProcessPaymentRequest = {
          booking_id: bookingId,
          gateway: 'stripe',
          payment_method_id: paymentMethodId,
        };

        const response = await paymentAPI.processPayment(request);
        return response.data;
      } catch (error: any) {
        console.error('Failed to process payment:', error);
        throw new Error(error.response?.data?.message || 'Failed to process payment');
      }
   },

   /**
    * Process payment with payment intent (alternative method)
    */
   async processPaymentWithIntent(
      _paymentIntentId: string,
      _paymentMethodId: string,
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
   },

   /**
    * Get Stripe instance for direct use
    */
   async getStripeInstance(): Promise<Stripe | null> {
      return getStripe();
   }
};