import { NavLink } from "react-router-dom";

export function NavBar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand">
          Cachet
        </NavLink>

        <nav className="navbar__nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "navbar__link navbar__link--active" : "navbar__link"
            }
          >
            Import
          </NavLink>

          <NavLink
            to="/bets"
            className={({ isActive }) =>
              isActive ? "navbar__link navbar__link--active" : "navbar__link"
            }
          >
            Bets
          </NavLink>
        </nav>
      </div>
    </header>
  );
}