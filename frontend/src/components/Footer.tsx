
import { Linkedin, Github, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-4 px-8 z-20 shadow-md">
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <span className="text-sm font-light">© 2025 — Developed by Rishikesh</span>
        <div className="flex items-center space-x-6 mt-2 md:mt-0">
          <a
            href="https://www.linkedin.com/in/rishikeshkakde/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link hover:-translate-y-[2px] transition-transform flex items-center gap-1"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
            <span className="sr-only">LinkedIn</span>
          </a>
          <a
            href="https://github.com/kakderishikesh"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link hover:-translate-y-[2px] transition-transform flex items-center gap-1"
            aria-label="GitHub"
          >
            <Github size={18} />
            <span className="sr-only">GitHub</span>
          </a>
          <a
            href="mailto:rishikesh.kakde59@gmail.com"
            className="footer-link hover:-translate-y-[2px] transition-transform flex items-center gap-1"
            aria-label="Email"
          >
            <Mail size={18} />
            <span className="sr-only">Email</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
