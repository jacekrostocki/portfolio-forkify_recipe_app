import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView.js';
import addrecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { __esModule } from 'start';
import addRecipeView from './views/addRecipeView.js';

//PARCEL CODE TO maintaine the state
// if (module.hot) {
// }
// module.hot.accept();

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    //get recipe ID from after hash
    const id = window.location.hash.slice(1); //slice to remove # and leave ID
    //// Guard clause if ID is empty
    if (!id) return;
    //renderSpinner
    recipeView.renderSpinner();
    //update results View to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    //load recipe into state object in model.js
    await model.loadRecipe(id);
    //rendering using imported Class / methods from recipeView.js
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.errorMessage(
      `Something went wrong with loading your recipe ;/: ${err}`
    );
  }
};

const controlSearchResults = async function () {
  try {
    //1. get search Phrase
    const searchPhrase = searchView.getSearchPhrase();

    if (!searchPhrase) return; //GUARD
    //2. get search results
    resultsView.renderSpinner();
    await model.loadSearchResults(searchPhrase);
    //2.5 reset pagination buttons
    model.state.search.page = 1;
    //3. render results
    resultsView.render(model.getSearchResultsPage());

    //4. render initial pagination btns
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.errorMessage(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update servings in state
  model.updateServings(newServings);
  //update recipe view

  recipeView.update(model.state.recipe);
};

const controlBookmarking = function () {
  //1. add recipe to bookmarks array + add attribute in recipe for other functions to acknowledge
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  console.log('removed bookmark', model.state.recipe);
  //2. Adding bookmark to bookmarks list
  bookmarksView.render(model.state.bookmarks);
  console.log('refreshed bookmarks state');
  //3. Update view (here fill bookmark icon)
  recipeView.update(model.state.recipe);
  console.log('refreshed bookmarks view');
};

const controlBookmarksRendering = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlRecipeUpload = async function (data) {
  try {
    //show spinner
    addRecipeView.renderSpinner();
    await model.uploadRecipe(data);
    //success message
    addRecipeView.succesMessage('Wszystko sie udalo :D!');
    //render own recipe
    recipeView.render(model.state.recipe);
    //render bookmarkview
    bookmarksView.render(model.state.bookmarks);

    //window.hstory methods to change url without reloading the page
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form
    setTimeout(function () {
      addRecipeView.toggleModalOveraly();
      setTimeout(function () {
        addRecipeView.render(model.state.recipe, true);
      }, 500);
    }, 2500);
  } catch (err) {
    console.error('arghh...cos poszlo nie tak jak trzeba ;/', err);
    addRecipeView.errorMessage(err.message);
  }
};
//INITIALIZE EVENT LISTENERS/HANDLERS
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarksRendering);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlBookmarking);
  addrecipeView.addHandlerUpload(controlRecipeUpload);
};
init();

//eventListener for hash change in url

//// window.addEventListener('hashchange', controlRecipes);
//// window.addEventListener('load',controlRecipes);
