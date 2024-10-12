"use client";

import { useState } from "react";

// Fake contact data
const contactDetails = {
  phoneNumber: "+1 (123) 456-7890",
  email: "support@techhub.com",
  address: "123 TechHub Avenue, Silicon Valley, CA",
};

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic (e.g., sending data to API)
    alert("Your message has been submitted!");
  };

  return (
    <div className="contact-us-page p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
          Contact Us
        </h1>
        <p className="text-lg text-gray-700 text-center mb-12">
          We would love to hear from you! Feel free to reach out to us for
          support, inquiries, or feedback.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-gray-700 mb-4">
              <strong>Phone:</strong> {contactDetails.phoneNumber}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Email:</strong>{" "}
              <a
                className="text-blue-600 underline"
                href={`mailto:${contactDetails.email}`}
              >
                {contactDetails.email}
              </a>
            </p>
            <p className="text-gray-700">
              <strong>Address:</strong> {contactDetails.address}
            </p>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <p className="block text-gray-700 font-semibold mb-2">
                  Your Name
                </p>
                <input
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <p className="block text-gray-700 font-semibold mb-2">
                  Your Email
                </p>
                <input
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-6">
                <p className="block text-gray-700 font-semibold mb-2">
                  Message
                </p>
                <textarea
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>
              <button
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                type="submit"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
