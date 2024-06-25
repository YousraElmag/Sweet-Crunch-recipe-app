                   

const showRecipe = document.querySelector('.right');
const randomRecipe = document.querySelector('.left');
const searchInput = document.querySelector('input');

const fovartiee = document.querySelector('.fovartie');
const soldheart = document.querySelector('.disp');
const main = document.querySelector('.main');
const back = document.querySelector('.home');
const face = document.querySelector('.face');
const logo = document.querySelector('.landing img');
const lastpost = document.querySelector('.lastpost span');

let cache = {};


async function getdata(id) {
    const cacheKey = `recipe_${id}`;
    const cacheDuration = 50 * 60 * 1000; 

    if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp < cacheDuration)) {
        console.log('Using data from cache');
        displayData(cache[cacheKey].data);
        return cache[cacheKey].data;
    }

    try {
        const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}?key=115fe27a-e5ce-422f-b500-b2cf680e6b41`);
        const data = await res.json();
        let recipe = data.data.recipe;
        recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients
        };

        cache[cacheKey] = {
            data: recipe,
            timestamp: Date.now()
        };

        displayData(recipe);
        return recipe;

    } catch (err) {
        console.log('Error:', err);
    }
}

function displayData(recipe) {
    const markup = `
        <div class="container">
            <div class="one">
                <img src="${recipe.image}" alt="">
                <h4>${recipe.title}</h4>
            </div>
            <div class="two">
                <p><span>${recipe.cookingTime}</span> MINUTES</p>
                <p><span>${recipe.servings}</span> SERVINGS</p>
                <a href="#"><i class="fa-regular fa-heart" data-id="${recipe.id}"></i></a>
            </div>
            <div class="three">
                <h3>Ingredients</h3>
                <ul>
                    ${recipe.ingredients.map(ing => `
                        <li>
                            <div class="recipe_quantity"><span>${ing.quantity || ''}</span> <span>${ing.unit || ''}</span> ${ing.description}</div>
                        </li>`).join('')}
                </ul>
            </div>
            <div class="four">
                <h3>How to cook it</h3>
                <p>This recipe was carefully designed and tested by Simply Recipes. Please check out directions at their website.</p>
                <button><a href="${recipe.sourceUrl}">Directions</a></button>
            </div>
        </div>
    `;

    showRecipe.innerHTML = markup;
    const heart = document.querySelector('.fa-regular');
    heart.addEventListener('click', () => toggleFavorite(recipe.id));
}

async function getmoredata(type) {
    try {
        const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${type}`);
        
        if (!res.ok) {
            if (res.status === 429) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
        }
        const data = await res.json();
        let recipes = data.data.recipes;

        recipes = recipes.sort(() => 0.5 - Math.random());
        recipes = recipes.slice(0, 10);

        const recipeMarkup = recipes.map(e => {
            return `<div class="box">
                <img src="${e.image_url}" alt="" data-id="${e.id}">
                <h3><a class='j' href="#">${e.title}</a><p>${e.publisher}</p></h3>
            </div>`;
        }).join('');

        randomRecipe.innerHTML = recipeMarkup; 
        const recipeElements = document.querySelectorAll('.box img');
        recipeElements.forEach(e => {
            e.addEventListener('click', () => {
                const id = e.getAttribute('data-id');
                window.scroll({
                    top: 300,
                    behavior: "smooth",
                });
                getdata(id);
            });
        });
        if (recipeElements.length > 0) {
            recipeElements[0].click();
        }
    } catch (err) {
        console.error(err);
    }
}

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const searchTerm = event.target.value.trim();
       
        fovartiee.style.display='none'
        main.style.display='grid'
        face.style.display='none'
        getmoredata(searchTerm);
    }
});

getmoredata('pizza');

function toggleFavorite(id) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavorites(); 
}

function loadFavorites() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let addfavarte = '';

    favorites.forEach(async (e) => {
        const recipe = await getdata(e);
        addfavarte += `<div class="box" data-id="${recipe.id}">
            <img src="${recipe.image}" alt="" >
            <h3><a class='j' href="#">${recipe.title}</a><p>${recipe.publisher}</p> <i class="fa-regular fa-trash-can"></i></h3>
        </div>`;
        document.querySelector('.data').innerHTML = addfavarte;

        const trashIcons = document.querySelectorAll('.fa-trash-can');
        trashIcons.forEach(trashIcon => {
            trashIcon.addEventListener('click', (event) => {
                const boxElement = event.target.closest('.box');
                if (boxElement) {
                    const idToRemove = boxElement.getAttribute('data-id');
                    boxElement.remove();

                    const updatedFavorites = favorites.filter(favId => favId !== idToRemove);
                    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
                }
            });
        });
    });
}


window.addEventListener('load', loadFavorites);

soldheart.addEventListener('click', () => {
    face.style.display = 'none';
    main.style.display = 'none';
    fovartiee.style.display = 'grid';
    loadFavorites(); 
});

back.addEventListener('click', () => {
    face.style.display = 'flex';
    fovartiee.style.display = 'none';
});

console.log(soldheart);

async function intro() {
    try {
        const res = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood');
        
        if (!res.ok) {
            if (res.status === 429) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
        }
        const data = await res.json();
        let recipe = data.meals;
        recipe = recipe.sort(() => 0.5 - Math.random());
        recipe = recipe.slice(0, 4);
             
        const recipeMarkup = recipe.map(e => {
            return `<img src="${e.strMealThumb}" alt="" data-id="${e.id}">`;
        }).join('');
        foot.innerHTML = recipeMarkup;

        const randomIndex = Math.floor(Math.random() * recipe.length);
        const selectedData = recipe[randomIndex];
        lastpost.innerText = selectedData.strMeal;
        
        lastpost.addEventListener('click', () => {
            fovartiee.style.display = 'none';
            main.style.display = 'grid';
            face.style.display = 'none';
            getmoredata(selectedData.strMeal);
        });
    } catch (err) {
        throw Error(console.log(err));
    }
}

const foot = document.querySelector('.footer');
setInterval(intro, 5000);

const jj = document.querySelectorAll('.list img');
jj.forEach(e => {
    const vegeee = e.getAttribute('data-name');
    e.addEventListener('click', () => {
        console.log(e);
        main.style.display = 'grid';
        face.style.display = 'none';
        getmoredata(vegeee);
    });
});

logo.addEventListener('click', () => {
    main.style.display = 'none';
    face.style.display = 'flex';
});

window.addEventListener('load', intro);
