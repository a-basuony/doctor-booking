let stripePromise: Promise<any> | null = null;

export const loadStripe = async (publishableKey: string) => {
   if (!stripePromise) {
      stripePromise = new Promise((resolve, reject) => {
         const script = document.createElement('script');
         script.src = 'https://js.stripe.com/v3/';
         script.onload = () => {
            resolve((window as any).Stripe(publishableKey));
         };
         script.onerror = () => {
            reject(new Error('Failed to load Stripe.js'));
         };
         document.body.appendChild(script);
      });
   }
   return stripePromise;
};