import { useEffect, useState } from "react";

const ToggleTheme = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));

  return (
    <button
      className="toggle-theme"
      onClick={toggleTheme}
      aria-label="toggle theme"
      type="button"
    >
      <img
        className="toggle-theme__icon-moon toggle-theme__toggle-icon"
        src={"/assets/images/icon-moon.svg"}
        alt="Dark Mode"
      />

      <img
        className="toggle-theme__icon-sun toggle-theme__toggle-icon"
        src={"/assets/images/icon-sun.svg"}
        alt="Light Mode"
      />
    </button>
  );
};

export default ToggleTheme;
