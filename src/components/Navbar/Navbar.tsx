import { ThemeToggler } from "@components/ThemeToggler/ThemeToggler";
import "./Navbar.scss";

export const Navbar = () => {
    return (
        <header>
            <h1 className="title">SReality API app</h1>
            <ThemeToggler />
        </header>
    )
}
