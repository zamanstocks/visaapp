// src/components/Footer.tsx

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Phone, Check, Shield } from 'lucide-react';

const Footer: React.FC = () => {
 const quickLinks = [
   { name: 'About Us', href: '/about' },
   { name: 'Track Application', href: '/track' },
   { name: 'Support Center', href: '/help' },
   { name: 'Contact', href: '/contact' }
 ];

 const legalLinks = [
   { name: 'Privacy Policy', href: '/privacy' },
   { name: 'Terms of Service', href: '/terms' },
   { name: 'Cookie Policy', href: '/cookies' },
   { name: 'Disclaimer', href: '/disclaimer' }
 ];

 const socialLinks = [
   { 
     name: 'Instagram',
     icon: <Instagram className="w-5 h-5" />,
     href: 'https://instagram.com/zipvisa'
   },
   { 
     name: 'Facebook',
     icon: <Facebook className="w-5 h-5" />,
     href: 'https://facebook.com/zipvisa'
   },
   { 
     name: 'X (Twitter)',
     icon: <Twitter className="w-5 h-5" />,
     href: 'https://x.com/zipvisa'
   },
   { 
     name: 'WhatsApp',
     icon: <Phone className="w-5 h-5" />,
     href: 'https://wa.me/message/zipvisa'
   }
 ];

 return (
   <footer className="bg-gradient-to-b from-gray-900 to-black text-white pt-12 pb-6 relative overflow-hidden">
     {/* Gradient overlay */}
     <div className="absolute inset-0 bg-grid-pattern opacity-5" />
     
     <div className="max-w-7xl mx-auto px-6 relative">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
         {/* Company Info */}
         <div className="col-span-1">
           <div className="flex items-center space-x-2 mb-6">
             <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
               zip<span className="text-white">visa.com</span>
             </span>
             <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></div>
           </div>
           <p className="text-gray-400 mb-6 text-sm leading-relaxed">
             Revolutionizing the visa application process with cutting-edge AI and world-class support.
           </p>
           <div className="flex flex-wrap gap-4">
             <div className="group flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2 hover:bg-gray-700/50 transition-colors">
               <Check className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
               <span className="text-sm text-gray-300">Government Licensed</span>
             </div>
             <div className="group flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2 hover:bg-gray-700/50 transition-colors">
               <Shield className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
               <span className="text-sm text-gray-300">Secure & Encrypted</span>
             </div>
           </div>
           
           {/* Social Links */}
           <div className="flex items-center space-x-4 mt-6">
             {socialLinks.map((link) => (
               <a
                 key={link.name}
                 href={link.href}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-gray-400 hover:text-white transition-all hover:scale-110"
                 aria-label={link.name}
               >
                 {link.icon}
               </a>
             ))}
           </div>
         </div>

         {/* Quick Links */}
         <div className="col-span-1">
           <h3 className="font-semibold text-gray-100 mb-4">Quick Links</h3>
           <ul className="space-y-3">
             {quickLinks.map((link) => (
               <li key={link.name}>
                 <Link 
                   href={link.href}
                   className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 group"
                 >
                   <span className="group-hover:translate-x-1 transition-transform">▸</span>
                   <span>{link.name}</span>
                 </Link>
               </li>
             ))}
           </ul>
         </div>

         {/* Legal Links */}
         <div className="col-span-1">
           <h3 className="font-semibold text-gray-100 mb-4">Legal</h3>
           <ul className="space-y-3">
             {legalLinks.map((link) => (
               <li key={link.name}>
                 <Link 
                   href={link.href}
                   className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 group"
                 >
                   <span className="group-hover:translate-x-1 transition-transform">▸</span>
                   <span>{link.name}</span>
                 </Link>
               </li>
             ))}
           </ul>
         </div>

         {/* Contact Info */}
         <div className="col-span-1">
           <h3 className="font-semibold text-gray-100 mb-4">Contact & Support</h3>
           <ul className="space-y-3">
             <li>
               <p className="text-sm text-gray-400 leading-relaxed">
                 <strong>Headquarters (Oman):</strong><br />
                 Zaman Integrated Projects L.L.C<br />
                 محافظة الداخلية, Oman<br />
                 Email: support@zipvisa.com
               </p>
             </li>
             <li>
               <p className="text-sm text-gray-400 leading-relaxed">
                 <strong>Branch Office (India):</strong><br />
                 Hajyar Building, Kalpetta<br />
                 Kerala, India
               </p>
             </li>
           </ul>
         </div>
       </div>

       {/* Copyright */}
       <div className="border-t border-gray-800 pt-8">
         <p className="text-center text-sm text-gray-400">
           © {new Date().getFullYear()} zipvisa.com. All rights reserved.
         </p>
       </div>
     </div>
   </footer>
 );
};

export default Footer;