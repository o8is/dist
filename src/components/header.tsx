import React from "react";
import { Link } from "react-router-dom";
import { Github } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="border-b border-o8-gray-400 bg-o8-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="px-3 h-16 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <span className="brand text-xl font-bold tracking-tight">o8</span>
            <span className="service-name text-xl">dist</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm font-medium text-o8-gray-200">
            <Link to="/my" className="hover:text-o8-white transition-colors">
              My dists
            </Link>
            <Link to="/about" className="hover:text-o8-white transition-colors">
              About
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
                    <a
            href="https://github.com/o8-is/dist"
            target="_blank"
            rel="noopener noreferrer"
            className="text-o8-gray-300 hover:text-o8-white transition-colors"
          >
            <Github size={20} />
          </a>
          
          <Link
            to="/"
            className="view-button view-button--primary flex items-center gap-2 no-underline"
          >
            New dist
          </Link>
        </div>
      </div>
    </header>
  );
};
