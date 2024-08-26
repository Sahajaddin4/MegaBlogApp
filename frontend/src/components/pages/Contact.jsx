import React from 'react'

function Contact() {
  return (
    <div className="contact-us container mx-auto px-4 py-12">
    <div className="max-w-[70%] mx-auto bg-white shadow-lg rounded-lg p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        Contact Us
      </h1>
      <p className="text-lg text-center mb-4">
        We're here to help! Reach out to us via the following methods:
      </p>

      <div className="contact-methods text-center">
        <div className="email mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Email Us</h2>
          <p className="text-blue-500">support@example.com</p>
        </div>

        <div className="phone mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Call Us</h2>
          <p className="text-blue-500">+1 (123) 456-7890</p>
        </div>

        <div className="hours">
          <h2 className="text-xl font-semibold text-gray-800">Business Hours</h2>
          <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
          <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
          <p className="text-gray-600">Sunday: Closed</p>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Contact