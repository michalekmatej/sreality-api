import { Link } from "react-router-dom";
import "./NotFoundPage.scss";

const NotFoundPage = () => {
    return (
        <main className="not-found container">
            <h1>Stránka nenalezena</h1>
            <p>Stránka, kterou hledáte, neexistuje.</p>
            <Link to="/">Zpět na hlavní stránku</Link>
        </main>
    );
}

export default NotFoundPage;
