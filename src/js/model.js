import { API_KEY, RES_PER_PAGE, API_URL } from './config.js';
import { async } from 'regenerator-runtime';
// import { getJSON, sendJSON } from './helper.js';
import { AJAX } from './helper.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    //1. Loading recipe API
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    ////new recipe Object create with better headers
    state.recipe = createRecipeObject(data);

    console.log(data);
    if (state.bookmarks.some(el => el.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.log(err);

    throw err;
  }
};

export const loadSearchResults = async function (search) {
  try {
    state.search.query = search;
    const data = await AJAX(`${API_URL}?search=${search}&key=${API_KEY}`);
    console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
  });

  state.recipe.servings = newServings;
};

const localStorageSet = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const localStorageGet = function () {
  const data = localStorage.getItem('bookmarks');
  if (data) state.bookmarks = JSON.parse(data);
};

export const addBookmark = function (recipe) {
  //add attribute if bookmarked
  if (recipe.id === state.recipe.id) {
    //add bookmark
    state.bookmarks.push(recipe);
    state.recipe.bookmarked = true;
  }
  localStorageSet();
};

export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  console.log(index);
  state.bookmarks.splice(index, 1);
  state.recipe.bookmarked = false;
  localStorageSet();
};

const init = function () {
  localStorageGet();
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

export const uploadRecipe = async function (newRecipe) {
  //convert Object newRecipe back into array to loop through and filter relevant items
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(elem => elem[0].startsWith('ingredie') && elem[1] !== '')
      .map(el => {
        const ingArr = el[1].replaceAll(' ', '').split(',');

        if (ingArr.length !== 3)
          throw new Error('Wrong length of the recipe. Pls use correct format');

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description }; //quantity, unit description put into object {}
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
