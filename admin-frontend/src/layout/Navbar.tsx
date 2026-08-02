import { Link, NavLink } from "react-router-dom";

const navItems = [
  { label: "Now Showing", to: "/" },
  { label: "All Movies", to: "/movies" },
  { label: "Theaters", to: "/theaters" },
  { label: "Offers", to: "/offers" },
  { label: "About Us", to: "/about" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 glass-surface border-b border-glass px-8 py-4 flex items-center justify-between">
      <Link to="/" className="font-heading font-black text-xl text-onSurface tracking-wide">
        CINE<span className="text-accent">STAR</span>
      </Link>

      <nav className="hidden md:flex gap-8">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `text-body-md font-body transition-colors hover:text-accent ${
                isActive ? "text-accent" : "text-onSurfaceVariant"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Link
        to="/profile"
        className="text-body-md font-body text-onSurface hover:text-accent transition-colors"
      >
        My Profile
      </Link>
    </header>
  );
}