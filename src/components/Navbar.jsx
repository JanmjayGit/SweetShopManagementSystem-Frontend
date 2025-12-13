import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Menu, X, Candy, LogOut, LogIn, UserCog } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <Candy className="text-pink-600" size={28} />
          <span className="text-xl font-bold text-gray-800">
            SweetShop
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">

          {/* Common Links */}
          {user && (
            <>
              <Link className="text-gray-700 hover:text-pink-600" to="/dashboard">
                Dashboard
              </Link>

              <Link className="text-gray-700 hover:text-pink-600" to="/search">
                Search
              </Link>
            </>
          )}

          {/* Admin Links */}
          {user?.role === "ADMIN" && (
            <>
              <Link
                className="text-gray-700 hover:text-pink-600 flex items-center gap-1"
                to="/admin"
              >
                <UserCog size={18} /> Admin Panel
              </Link>
            </>
          )}

          {/* Auth Buttons */}
          {!user ? (
            <Link
              to="/"
              className="bg-pink-600 text-white px-4 py-1.5 rounded-md hover:bg-pink-700 flex items-center gap-1"
            >
              <LogIn size={18} /> Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-gray-800 text-white px-4 py-1.5 rounded-md hover:bg-gray-900 flex items-center gap-1"
            >
              <LogOut size={18} /> Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)}>
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-4">

          {user && (
            <>
              <Link
                className="block text-gray-700 hover:text-pink-600"
                to="/dashboard"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                className="block text-gray-700 hover:text-pink-600"
                to="/search"
                onClick={() => setOpen(false)}
              >
                Search
              </Link>
            </>
          )}

          {user?.role === "ADMIN" && (
            <Link
              className="block text-gray-700 hover:text-pink-600"
              to="/admin"
              onClick={() => setOpen(false)}
            >
              Admin Panel
            </Link>
          )}

          {!user ? (
            <Link
              to="/"
              className="block bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
              className="block w-full bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
