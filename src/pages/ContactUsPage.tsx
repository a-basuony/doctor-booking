import { useState } from 'react';
import { Mail, Phone, MapPin, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const ContactUsPage = () => {
   const [formData, setFormData] = useState({
      name: '',
      email: '',
      message: ''
   });
   
   const [loading, setLoading] = useState(false);
   const [success, setSuccess] = useState(false);
   const [error, setError] = useState('');

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: value
      }));
      if (error) setError('');
      if (success) setSuccess(false);
   };

   const handleSubmit = async () => {
      if (!formData.name || !formData.email || !formData.message) {
         setError('All fields are required');
         return;
      }
      
      if (formData.message.length < 10) {
         setError('Message must be at least 10 characters');
         return;
      }

      setLoading(true);
      setError('');
      setSuccess(false);

      try {
         const response = await fetch('https://round8-backend-team-one.huma-volve.com/api/contact-us', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
         });

         if (!response.ok) {
            throw new Error(`Failed to send message. Status: ${response.status}`);
         }

         await response.json();
         setSuccess(true);
         setFormData({ name: '', email: '', message: '' });
         
      } catch (err) {
         const errorMessage = err instanceof Error ? err.message : 'Failed to send message. Please try again.';
         setError(errorMessage);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-white flex justify-center items-center py-16">
         <div className="w-full max-w-6xl px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
               
               {/* Left Column - Info */}
               <div className="flex flex-col space-y-8">
                  <div className="space-y-4">
                     <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
                        Contact Us
                     </h1>
                     <p className="text-lg text-gray-700 leading-relaxed">
                        We are committed to processing the information in order to contact you
                        and talk about your questions.
                     </p>
                  </div>

                  <div className="space-y-6 pt-4">
                     <div className="flex items-center space-x-3">
                        <Phone className="text-blue-600 text-xl flex-shrink-0" size={24} />
                        <span className="text-gray-700 text-lg font-medium">
                           080 707 555-321
                        </span>
                     </div>

                     <div className="flex items-center space-x-3">
                        <Mail className="text-blue-600 text-xl flex-shrink-0" size={24} />
                        <span className="text-gray-700 text-lg font-medium">
                           demo@example.com
                        </span>
                     </div>

                     <div className="flex items-start space-x-3">
                        <MapPin className="text-blue-600 text-xl mt-1 flex-shrink-0" size={24} />
                        <span className="text-gray-700 text-lg font-medium">
                           526 Melrose Street, Water Mill, 11976
                           <br />
                           New York
                        </span>
                     </div>
                  </div>
               </div>

               {/* Right Column - Form */}
               <div className="space-y-6 w-full">
                  
                  {/* Success Message */}
                  {success && (
                     <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                        <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                        <div className="flex-1">
                           <p className="text-green-800 font-medium">Success!</p>
                           <p className="text-green-700 text-sm">Your message has been sent successfully.</p>
                        </div>
                        <button
                           onClick={() => setSuccess(false)}
                           className="text-green-600 hover:text-green-800 text-xl leading-none"
                        >
                           ×
                        </button>
                     </div>
                  )}
                  
                  {/* Error Message */}
                  {error && (
                     <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                        <div className="flex-1">
                           <p className="text-red-800 font-medium">Error</p>
                           <p className="text-red-700 text-sm">{error}</p>
                        </div>
                        <button
                           onClick={() => setError('')}
                           className="text-red-600 hover:text-red-800 text-xl leading-none"
                        >
                           ×
                        </button>
                     </div>
                  )}

                  {/* Name Field */}
                  <div>
                     <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                     </label>
                     <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                     />
                  </div>

                  {/* Email Field */}
                  <div>
                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                     </label>
                     <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                     />
                  </div>

                  {/* Message Field */}
                  <div>
                     <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message * (minimum 10 characters)
                     </label>
                     <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        disabled={loading}
                        rows={6}
                        placeholder="Enter your message (at least 10 characters)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                     />
                     <p className="text-sm text-gray-500 mt-1">
                        {formData.message.length} / 10 minimum characters
                     </p>
                  </div>

                  {/* Submit Button */}
                  <button
                     onClick={handleSubmit}
                     disabled={loading}
                     className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-8"
                  >
                     {loading ? (
                        <>
                           <Loader2 className="animate-spin" size={20} />
                           <span>Sending...</span>
                        </>
                     ) : (
                        <span>Submit</span>
                     )}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ContactUsPage;