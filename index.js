// Define a global variable to store the favorite superheroes
let favorites = [];

document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);

function handleDOMContentLoaded() {
    const searchBtn = document.getElementById("search-btn");

    searchBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const input = document.getElementById('search-box').value;
        getSuperHero(input); // Call getSuperHero with the input value
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('search', input);
        const newUrl = window.location.pathname + '?' + urlParams.toString();
        window.history.pushState({ path: newUrl }, '', newUrl);
    });

    window.addEventListener('popstate', function (event) {
        // Reload the page or perform any other actions as needed
        location.reload();
    });

    // Add event listener for Favorites button
    const favoritesBtn = document.getElementById('favourites');
    favoritesBtn.addEventListener('click', displayFavorites);
}
//fetching hero details
async function getSuperHero(input) {
    if (input.length == 0) {
        alert(" Please Enter a Hero Name");
        return;
    }
    const url = `https://gateway.marvel.com:443/v1/public/characters?name=${input}&ts=1&apikey=e7e98ec422f51c0d4ecdd5eae7e4646f&hash=cdfa8dff7da35b2c8b6cb76d8764b941`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        let results = data.data.results;
        console.log(results);
        displayHero(results);
        if (results.length === 0) {
            const modifiedUrl = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${input}&ts=1&apikey=e7e98ec422f51c0d4ecdd5eae7e4646f&hash=cdfa8dff7da35b2c8b6cb76d8764b941`;
            const newResponse = await fetch(modifiedUrl);
            if (!newResponse.ok) {
                throw new Error('Network response was not ok');
            }
            const newData = await newResponse.json();
            results = newData.data.results;
            console.log(results);
        }
        displayHero(results);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
//display hero function
async function displayHero(results) {
    const container = document.getElementById('hero-container');
    container.innerHTML = '';
    if (results.length > 0) {
        results.forEach(hero => {
            const herocard = document.createElement('div');
            container.appendChild(herocard);
            herocard.classList.add('herocard', 'flex', 'flex-col', 'items-center');

            // Check if hero is in favorites
            const isFavorite = favorites.some(favorite => favorite.id === hero.id);
            const favoriteIcon = isFavorite ? 'fa-solid fa-star' : 'far fa-star'; // Define favoriteIcon here

            herocard.innerHTML = `
            <div class="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-lg mx-auto" data-v0-t="card">
            <div class="flex flex-col items-center gap-4 p-6 bg-red-800 dark:bg-red-900 text-white">
              <img
                src="${hero.thumbnail.path}.${hero.thumbnail.extension}"
                alt="Superhero Image"
                width="150"
                height="200"
                class="object-cover w-40 h-60 rounded-lg"
                style="aspect-ratio: 400 / 600; object-fit: cover;"
              />
              <div class="text-center">
                <h2 class="text-xl font-bold">${hero.name}</h2>
                <i class="fa-solid fa-circle-info inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2" onclick="MoreInfo('${hero.id}')" style="cursor: pointer;">More Info</i>
                <i class="${favoriteIcon} inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2" onclick="handleFavorites('${hero.id}')" style="cursor: pointer;"></i>
              </div>
            </div>
          </div>
            `;
        });
    } else {
        container.innerHTML = '<p class="not-found">No superheroes found</p>';
    }
}
//handler function for adding and removing from favorites
function handleFavorites(heroId) {
    const index = favorites.findIndex(favorite => favorite.id === heroId);
    console.log("Index to remove:", index); // Log index value
    if (index !== -1) {
        // Hero is already in favorites, remove it
        removeFromFavorites(heroId);
    } else {
        // Hero is not in favorites, add it
        addToFavorites(heroId);
    }
}

function removeFromFavorites(heroId) {
    favorites = favorites.filter(favorite => favorite.id !== heroId);
    localStorage.setItem("favorites", JSON.stringify(favorites)); // Update localStorage
    // Refresh the displayed favorites

    alert("Removed from favorites");

}
function removeFromFavoritess(heroId) {
    favorites = favorites.filter(favorite => favorite.id !== heroId);
    localStorage.setItem("favorites", JSON.stringify(favorites)); // Update localStorage
    // Refresh the displayed favorites
    displayFavorites();
    alert("Removed from favorites");

}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}
// more info
async function MoreInfo(heroId) {
    console.log("clicked");

    const hero = await getSuperHeroById(heroId);
    const container = document.getElementById('hero-container');
    container.innerHTML = '';
    if (hero) {
        const herocard = document.createElement('div');
        container.appendChild(herocard);
        herocard.classList.add('herocard', 'flex', 'flex-col', 'items-center');
        const isFavorite = favorites.some(favorite => favorite.id === hero.id);
        const favoriteIcon = isFavorite ? 'fa-solid fa-star' : 'far fa-star'; // Define favoriteIcon here
        console.log(`${hero.comics.available}`);
        let desc = "";
        if (hero.description == "") {
            desc = "NO description available";
        }
        else {
            desc = hero.description;
        }
        herocard.innerHTML = `
        <div class="card flex gap-6">
        <div class="card-img ">
          <img class="card-img"
            src="${hero.thumbnail.path}.${hero.thumbnail.extension}"
            alt="Cover"
            
          />
        </div>
        <div class="grid gap-4 text-white">

          <div>
          <h1 class=" hero-name text-3xl font-bold tracking-tighter lg:text-5xl">${hero.name}</h1>
          <h2 class="desc text-xl font-bold"><span class="heading">Description:</span>${desc}</h2>
          </div>
          <div>
          <h2 class="text-xl font-bold"><span class="heading">Series:</span>${hero.series.available}</h2>
          </div>
          <div>
          <h2 class="text-xl font-bold"><span class="heading">Comics:</span>${hero.comics.available}</h2>
          </div>
          <div>
          <h2 class="text-xl font-bold"><span class="heading">Stories:</span>${hero.stories.available}</h2>
          </div>
          <div>
          <i class="${favoriteIcon} inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2" onclick="handleFavorites('${hero.id}')" style="cursor: pointer;"></i>
          </div>
          </div>
        </div>
        </div>
        `;
        container.appendChild(modal);
    }
}


// Function to add superhero to favorites
function addToFavorites(heroId) {
    // Check if hero is already in favorites
    if (!favorites.find(favorite => favorite.id === heroId)) {
        // Add hero to favorites
        favorites.push({ id: heroId }); // Assuming hero object has an id property
        console.log(favorites);


        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert("Added to favorites");
        // Update star icon color to yellow
        const starIcon = document.querySelector(`[onclick="addToFavorites('${heroId}')"]`);
        if (starIcon) {
            starIcon.style.color = 'yellow';
        }

    }
}
//get superhero by id to fetch
async function getSuperHeroById(heroId) {
    const url = `https://gateway.marvel.com:443/v1/public/characters/${heroId}?ts=1&apikey=e7e98ec422f51c0d4ecdd5eae7e4646f&hash=cdfa8dff7da35b2c8b6cb76d8764b941`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error fetching hero');
        }
        const data = await response.json();
        return data.data.results[0];
    } catch (error) {
        console.error('error fetching hero:', error);
    }
}
//displaying favorites
async function displayFavorites() {
    const container = document.getElementById('hero-container');
    container.innerHTML = "";
    favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.length === 0) {
        container.innerHTML = '<p class="not-found">No Favourites added yet..</p>';
        return;
    }
    for (const favorite of favorites) {
        const hero = await getSuperHeroById(favorite.id);
        if (hero) {
            const herocard = document.createElement('div');
            container.appendChild(herocard);
            herocard.classList.add('herocard', 'flex', 'flex-col', 'items-center');

            herocard.innerHTML = `
            <div class="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-lg mx-auto" data-v0-t="card">
            <div class="flex flex-col items-center gap-4 p-6 bg-red-800 dark:bg-red-900 text-white">
              <img
                src="${hero.thumbnail.path}.${hero.thumbnail.extension}"
                alt="Superhero Image"
                width="150"
                height="200"
                class="object-cover w-40 h-60 rounded-lg"
                style="aspect-ratio: 400 / 600; object-fit: cover;"
              />
              <div class="text-center">
                <h2 class="text-xl font-bold">${hero.name}</h2>
                <i class="fa-solid fa-circle-info inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2" onclick="MoreInfo('${hero.id}')" style="cursor: pointer;">More Info</i>
                          <i class="fa-solid fa-trash inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2" onclick="removeFromFavoritess('${hero.id}')" style="cursor: pointer;"></i>
              </div>
            </div>
          </div>
            `;
        }
       
    }
}
