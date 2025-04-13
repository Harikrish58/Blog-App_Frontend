import React from "react";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { Link } from "react-router-dom";

const FooterCom = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto text-center">
        <div className="flex justify-center gap-6 mb-4">
          {/* About Page Link */}
          <Link to="/about" className="hover:underline text-sm">
            About
          </Link>

          {/* GitHub Link */}
          <a
            href="https://github.com/Harikrish58"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <BsGithub size={24} />
          </a>

          {/* LinkedIn Link */}
          <a
            href="https://www.linkedin.com/in/hari-krishnan-283360138/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <BsLinkedin size={24} />
          </a>
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} DevHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterCom;
