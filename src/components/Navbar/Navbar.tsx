import { ThemeToggler } from "@components/ThemeToggler/ThemeToggler";
import "./Navbar.scss";
import { Link } from "react-router-dom";

interface INavbarProps {
    showBackArror?: boolean;
}

export const Navbar = ({ showBackArror = false }: INavbarProps) => {
    return (
        <header>
            <h1 className="title">
                {showBackArror && <Link to="/" className="back-arrow">←</Link>}
                <Link to="/">SReality API aplikace</Link></h1>
            <ThemeToggler />
        </header>
    )
}
