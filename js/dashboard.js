/* =========================================================
   SARA'S & HAIDAR'S DASHBOARD
   ========================================================= */


/* =========================
   CLOCK
   ========================= */

const clock =
    document.getElementById("clock");


function updateClock() {

    const now =
        new Date();

    clock.textContent =
        now.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
}


updateClock();

setInterval(
    updateClock,
    1000
);


/* =========================
   DARK / LIGHT MODE
   ========================= */

const root =
    document.documentElement;

const themeButton =
    document.getElementById(
        "themeToggle"
    );

const themeIcon =
    document.getElementById(
        "themeIcon"
    );


const savedTheme =
    localStorage.getItem(
        "sh-theme"
    );


if (savedTheme) {

    root.setAttribute(
        "data-theme",
        savedTheme
    );

} else {

    root.setAttribute(
        "data-theme",
        "dark"
    );
}


function updateThemeIcon() {

    const theme =
        root.getAttribute(
            "data-theme"
        );

    themeIcon.textContent =
        theme === "dark"
            ? "☀️"
            : "🌙";
}


updateThemeIcon();


themeButton.addEventListener(
    "click",
    () => {

        const current =
            root.getAttribute(
                "data-theme"
            );

        const next =
            current === "dark"
                ? "light"
                : "dark";

        root.setAttribute(
            "data-theme",
            next
        );

        localStorage.setItem(
            "sh-theme",
            next
        );

        updateThemeIcon();
    }
);


/* =========================
   GAME SEARCH
   ========================= */

const search =
    document.getElementById(
        "gameSearch"
    );

const cards =
    Array.from(
        document.querySelectorAll(
            ".game-card"
        )
    );

let currentCategory =
    "all";


function updateVisibleGames() {

    const query =
        search.value
            .trim()
            .toLowerCase();


    cards.forEach(
        card => {

            const gameName =
                card.dataset.name
                    .toLowerCase();

            const category =
                card.dataset.category;


            const matchesSearch =
                gameName.includes(
                    query
                );


            const matchesCategory =
                currentCategory === "all" ||
                category === currentCategory;


            card.classList.toggle(
                "hidden",
                !(
                    matchesSearch &&
                    matchesCategory
                )
            );
        }
    );
}


search.addEventListener(
    "input",
    updateVisibleGames
);


/* =========================
   FILTERS
   ========================= */

const filters =
    document.querySelectorAll(
        ".filter"
    );


filters.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                filters.forEach(
                    filter =>
                        filter.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                currentCategory =
                    button.dataset.filter;


                updateVisibleGames();
            }
        );
    }
);


/* =========================
   PLAY COUNTER
   ========================= */

const playedElement =
    document.getElementById(
        "playedCount"
    );


let plays =
    Number(
        localStorage.getItem(
            "sh-total-plays"
        )
    ) || 0;


playedElement.textContent =
    plays;


cards.forEach(
    card => {

        card.addEventListener(
            "click",
            () => {

                plays++;

                localStorage.setItem(
                    "sh-total-plays",
                    plays
                );
            }
        );
    }
);
