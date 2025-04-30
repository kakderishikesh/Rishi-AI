import React from "react";
import { FaGithub, FaLinkedin, FaGlobe, FaMedium } from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white border-r border-gray-300 shadow-md transform transition-transform duration-300 ease-in-out flex flex-col justify-between ${
        isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
      } z-20`}
    >
      {/* Top Section */}
      <div className="p-4 flex flex-col items-center">
        <img
          src="lovable-uploads/9e54211b-4aa8-4122-aa1d-5ccdc40b6e5c.png"
          alt="Rishi Avatar"
          className="w-24 h-24 rounded-full mt-2 mb-4"
        />
        <h3 className="text-lg font-semibold">Rishikesh Kakde</h3>
        <p className="text-sm text-center mt-1 text-gray-600">Rishi AI v1.0.0</p>

        {/* Buttons */}
        <div className="mt-6 w-full px-4 space-y-3">
          <a
            href="https://github.com/kakderishikesh"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-gray-800 rounded-md hover:bg-gray-700 transition"
          >
            <FaGithub className="mr-2" /> GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/rishikeshkakde/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500 transition"
          >
            <FaLinkedin className="mr-2" /> LinkedIn
          </a>
          <a
            href="https://rishikeshkakde.framer.website/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-500 transition"
          >
            <FaGlobe className="mr-2" /> Portfolio
          </a>
          <a
            href="https://medium.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-500 transition"
          >
            <FaMedium className="mr-2" /> Read the Article
          </a>
        </div>
      </div>

      {/* Disclaimer at Bottom */}
      <div className="px-4 pb-4 text-xs text-center text-gray-500">
        Interactions with Rishi AI may be used to improve the AI's performance.
      </div>
    </div>
  );
}