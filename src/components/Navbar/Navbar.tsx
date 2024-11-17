import { ThemeToggler } from "@components/ThemeToggler/ThemeToggler";
import "./Navbar.scss";

export const Navbar = () => {
    return (
        <header>
            <h1 className="title">SReality API aplikace</h1>
            <ThemeToggler />
        </header>
    )
}
