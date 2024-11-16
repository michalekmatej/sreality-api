import { ThemeToggler } from "@components/ThemeToggler/ThemeToggler";
import { TableSection } from "./components/TableSection/TableSection";

const MainPage = () => {
    return (
        <div>
            <div className="flex">
                <h1>Hello world</h1>
                <ThemeToggler />
            </div>

            <TableSection />

        </div>
    )
}

export default MainPage;
