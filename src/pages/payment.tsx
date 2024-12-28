// src/pages/payment.tsx
import { useRouter } from 'next/router';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

export default function PaymentPage() {
 const router = useRouter();
 const { id, phone } = router.query;

 return (
   <>
     <Head>
       <title>Payment System Maintenance - Zipvisa.com</title>
       <meta name="description" content="Payment system temporarily under maintenance" />
     </Head>
     
     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
       <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
           <div className="p-6 md:p-8 bg-gradient-to-r from-blue-600 to-indigo-600">
             <div className="h-8 text-white font-bold text-xl">
             Zipvisa.com
             </div>
           </div>
           
           <div className="p-6 md:p-8 space-y-6">
             <div className="flex items-start gap-4">
               <div className="bg-amber-100 rounded-full p-3">
                 <AlertCircle className="w-6 h-6 text-amber-600" />
               </div>
               <div className="space-y-2">
                 <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                   Payment System Temporarily Unavailable
                 </h1>
                 <p className="text-gray-600">
                   We're currently experiencing technical issues with our payment system. Our team is working diligently to resolve this matter.
                 </p>
               </div>
             </div>

             <hr className="border-gray-200" />

             <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
               <h2 className="font-medium text-gray-900 mb-2">Your Booking Details</h2>
               <div className="grid gap-1 text-sm text-gray-600">
                 <p>Reference ID: {id}</p>
                 {phone && <p>Contact: {phone}</p>}
               </div>
             </div>

             <div className="bg-green-50 rounded-lg p-4 border border-green-200">
               <h2 className="font-medium text-green-800 mb-2">Need Assistance?</h2>
               <p className="text-sm text-green-700 mb-4">
                 Our customer service team is ready to assist you with alternative payment arrangements.
               </p>
               <Link
                 href={`https://wa.me/968782042289?text=Hi,%20I%20need%20help%20with%20my%20booking%20${id}`}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
               >
                 <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                   <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                 </svg>
                 <span>Contact Support</span>
               </Link>
             </div>

             <div className="text-center">
               <button
                 onClick={() => router.back()}
                 className="text-gray-600 hover:text-gray-900 text-sm"
               >
                 ← Return to previous page
               </button>
             </div>
           </div>
         </div>
       </div>
     </div>
   </>
 );
}