import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const Header = () => {
  return (
    <header className="bg-slate-300 shadow-md ">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Brick</span>
            <span className="text-slate-700">Nest</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-4">
          <Link to="/about">
            <li className="hidden sm:inline text-slate-800 font-semibold hover:underline cursor-pointer">
              About
            </li>
          </Link>
          <Link to="/register">
            <li className="hidden sm:inline text-slate-800 font-semibold hover:underline cursor-pointer">
              Register
            </li>
          </Link>
          <Link to="/login">
            <li className="text-slate-800 font-semibold hover:underline cursor-pointer">
              Login
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
