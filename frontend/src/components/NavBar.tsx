
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="w-full bg-[#f5f5f5] text-neutral-900 shadow z-20">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center px-8 py-4">
        <Link
          to="/"
          className="font-extrabold text-xl hover:scale-105 transition-transform"
          style={{ letterSpacing: ".06em" }}
        >
          Rishi
        </Link>
        <div className="flex flex-row gap-8 text-[16px] font-medium items-center">
          <a
            href="https://medium.com/@rkakde"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary hover:-translate-y-[2px] transition-all"
          >
            Blog
          </a>
          <a
            href="/#about-me"
            className="hover:text-primary hover:-translate-y-[2px] transition-all"
          >
            About Me
          </a>
          <a
            href="/projects"
            className="hover:text-primary hover:-translate-y-[2px] transition-all"
          >
            Projects
          </a>
          <a
            href="/#contact-section"
            className="hover:text-primary hover:-translate-y-[2px] transition-all"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}
