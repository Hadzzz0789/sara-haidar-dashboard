const clock = document.getElementById("clock");
const search = document.getElementById("search");

const cards =
    [...document.querySelectorAll(".game-card")];

const filters =
    [...document.querySelectorAll(".filter")];


function updateClock() {

    const now = new Date();

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

setInterval(updateClock, 1000);


let currentFilter = "all";


function updateGames() {

    const query =
        search.value.toLowerCase();

    cards.forEach(card => {

        const name =
            card.dataset.name.toLowerCase();

        const category =
            card.dataset.category;

        const matchesSearch =
            name.includes(query);

        const matchesFilter =
            currentFilter === "all" ||
            category === currentFilter;

        card.classList.toggle(
            "hidden",
            !(matchesSearch && matchesFilter)
        );
    });
}


search.addEventListener(
    "input",
    updateGames
);


filters.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filters.forEach(
                b => b.classList.remove("active")
            );

            button.classList.add("active");

            currentFilter =
                button.dataset.filter;

            updateGames();
        }
    );
});


cards.forEach(card => {

    card.addEventListener(
        "click",
        () => {

            const played =
                Number(
                    localStorage.getItem(
                        "shGamesPlayed"
                    )
                ) || 0;

            localStorage.setItem(
                "shGamesPlayed",
                played + 1
            );
        }
    );
});


document.getElementById(
    "gamesPlayed"
).textContent =
    localStorage.getItem(
        "shGamesPlayed"
    ) || 0;
