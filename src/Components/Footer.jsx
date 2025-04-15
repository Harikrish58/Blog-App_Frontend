// FooterCom.jsx
// Reusable footer component with About link, GitHub and LinkedIn icons

import React from "react";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { Link } from "react-router-dom";

const FooterCom = () => {
  return (
    // Footer container with background and text color
    <footer className="bg-gray-800 text-white py-6">
      {/* Centered content inside max-width container */}
      <div className="container mx-auto text-center">
        {/* Link section */}
        <div className="flex justify-center gap-6 mb-4">
          {/* Internal About page link */}
          <Link to="/about" className="hover:underline text-sm">
            About
          </Link>

          {/* External GitHub profile link */}
          <a
            href="https://github.com/Harikrish58"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <BsGithub size={24} />
          </a>

          {/* External LinkedIn profile link */}
          <a
            href="https://www.linkedin.com/in/hari-krishnan-283360138/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <BsLinkedin size={24} />
          </a>
        </div>

        {/* Copyright text */}
        <p className="text-sm">
          &copy; {new Date().getFullYear()} DevHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterCom;
