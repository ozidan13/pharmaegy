'use client';

import {ToastContainer } from 'react-toastify';
import Image from 'next/image';

import LoginForm from '../components/LoginForm';




export default function AdminLoginPage() {
 

  return (
   <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div className="w-full max-w-5xl">
     <ToastContainer theme="colored" position="top-right" autoClose={2000} />
    <div className="bg-white/20 rounded-2xl overflow-hidden shadow-lg w-full mb-10">

      {/* Title Section */}
      <div className="mb-5 text-center">
        <div className="flex items-center justify-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 mt-7">
            <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 2.676-.732 5.016-2.297 6.894-4.622.058-.072.114-.145.168-.22A12.035 12.035 0 0021 9a12.02 12.02 0 00-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-7">
            Admin Login
          </h2>
        </div>
        <p className="mt-2 text-sm text-gray-600 mb-2">
          Access the administrative dashboard
        </p>
      </div>

    
      <div className="flex flex-col md:flex-row bg-white/20 rounded-2xl overflow-hidden shadow-lg md:h-[500px]">

     
        <div className="flex-1 h-64 md:h-full">
          <Image
            src="/images/loginimg.png"
            alt="Illustration"
            className="w-full h-full object-cover animate-float"
            width={500}
            height={500}
          
          />
        </div>

     
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8">
  
       <LoginForm/>
       
     

          </div>
        </div>
      </div>
    </div>
  </div>
</div>


  );
}