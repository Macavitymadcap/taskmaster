class ThemeManager {
    static instance;
    constructor() {
        if (ThemeManager.instance) return ThemeManager.instance;
        this.html = document.documentElement;
        this.themeSwitch = null;
        this.init();
        ThemeManager.instance = this;
    }

    init() {
        this.setDefaultTheme();
        this.bindThemeToggleEvent();
    }

    setDefaultTheme() {
        const saved = localStorage.getItem("theme");
        const prefersDarkScheme =
            window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (saved) {
            this.setTheme(saved);
        } else if (prefersDarkScheme) {
            this.setTheme("dark");
        } else {
            this.setTheme("light");
        }
    }

    bindThemeToggleEvent() {
        this.themeSwitch = htmx.find("#theme-switch");
        if (this.themeSwitch) {
            const newSwitch = this.themeSwitch.cloneNode(true);
            this.themeSwitch.parentNode.replaceChild(newSwitch, this.themeSwitch);
            this.themeSwitch = newSwitch;
            htmx.on(this.themeSwitch, "change", () => {
                this.setTheme(
                    this.html.getAttribute("data-theme") === "dark"
                        ? "light"
                        : "dark",
                );
            });
        }
    }

    setTheme(theme) {
        this.html.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const themeManager = new ThemeManager();

    document.addEventListener("htmx:afterSwap", (e) => {
        themeManager.bindThemeToggleEvent();
    });
});
