import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-100 text-gray-700 text-center py-4 mt-8">
      <p>&copy; {new Date().getFullYear()} AirBooking. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
