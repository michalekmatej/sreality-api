import { useTheme } from "@/lib/themeContext/themeContext";
import { Switch } from "@mui/material";

export const ThemeToggler = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <div className="theme-toggler">
            <Switch
                checked={theme === "dark"}
                onChange={toggleTheme}
                inputProps={{ "aria-label": "controlled" }}
            />
            <span>{theme === "dark" ? "Dark" : "Light"}</span>
        </div>

    )
}
