
export interface IReviews {
  id: string,
  name: string,
  avatar: string,
  rating: number,
  comment: string,
  time: string,
}

export interface IDoctor {
  id: string;
  name: string;
  specialty: string;
  about: string,
  hospital: string;
  rating: number;
  image: string;
  availability: string;
  price: number;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  reviews: IReviews[]
}



//////////////////////////////////--PaymentMethod--///////////////////////////////////////////////
export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault?: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  doctorPrice: number;
  location: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  clientSecret?: string;
}

export interface CardFormData {
  cardNumber: string;
  cardholderName: string;
  expiry: string;
  cvc: string;
}


//////////////////////////////////--INotification--///////////////////////////////////////////////

export interface INotification {
  id: string;
  title: string;
  message: string;
  type: 'upcoming' | 'completed' | 'cancelled' | 'info';
  isRead: boolean;
  createdAt: string;
  appointmentId?: string;
}

export interface INotificationsResponse {
  status: boolean;
  message: string;
  data: INotification[];
}