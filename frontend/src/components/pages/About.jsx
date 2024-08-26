import React from 'react'

function About() {
  return (
    <div className="about-us container mx-auto px-4 py-12">
      <div className="max-w-[80%] mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">
          About Us
        </h1>

        <div className="intro text-lg text-gray-700 mb-6">
          <p>
            Welcome to our company! We are a passionate team dedicated to
            providing the best services and products to our customers. Our
            journey began with a simple idea and a commitment to quality, and
            over the years, we've grown into a trusted name in the industry.
          </p>
        </div>

        <div className="mission-vision text-lg text-gray-700 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p>
            Our mission is to deliver exceptional value and exceed our
            customers' expectations. We believe in continuous improvement,
            innovation, and maintaining the highest standards in everything we
            do.
          </p>
        </div>

        <div className="team text-lg text-gray-700 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Team
          </h2>
          <p>
            Our team is our greatest asset. We are a group of passionate
            professionals with diverse backgrounds and expertise, working
            together to achieve common goals. We believe in fostering a
            collaborative and inclusive work environment.
          </p>
        </div>

        <div className="values text-lg text-gray-700 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Values
          </h2>
          <p>
            Integrity, commitment, and customer satisfaction are the core values
            that drive us. We strive to build lasting relationships with our
            clients, partners, and the community by adhering to these values in
            every aspect of our business.
          </p>
        </div>

        <div className="contact-info text-center mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Get in Touch
          </h2>
          <p className="text-blue-500">Email: info@example.com</p>
          <p className="text-blue-500">Phone: +1 (123) 456-7890</p>
        </div>
      </div>
    </div>
  )
}

export default About