import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _overlay = document.querySelector('.overlay');
  _modal = document.querySelector('.add-recipe-window');
  _btnClose = document.querySelector('.btn--close-modal');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');

  constructor() {
    super();
    this._addHandlerAddRecipeShowModal();
    this._addHandlerAddRecipeCloseModal();
  }

  toggleModalOveraly() {
    this._overlay.classList.toggle('hidden');
    this._modal.classList.toggle('hidden');
  }

  _addHandlerAddRecipeShowModal() {
    this._btnOpen.addEventListener('click', this.toggleModalOveraly.bind(this));
  }

  _addHandlerAddRecipeCloseModal() {
    this._btnClose.addEventListener(
      'click',
      this.toggleModalOveraly.bind(this)
    );
    this._overlay.addEventListener('click', this.toggleModalOveraly.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      //get data from the form into variable via FormData() method. Good to unpack into array to get [[key,value],[k,v]]
      const dataArray = [...new FormData(this)];
      //Convert above array into Object
      const data = Object.fromEntries(dataArray);
      //Object.entries(obj) - takes in Object to convert into array. OPPOSITe
      handler(data);
    });
  }
  _generateMarkup() {
    return `
    <button class="btn--close-modal">&times;</button>
    <form class="upload">
      <div class="upload__column">
        <h3 class="upload__heading">Recipe data</h3>
        <label>Title</label>
        <input value="TEST55" required name="title" type="text" />
        <label>URL</label>
        <input value="TEST55" required name="sourceUrl" type="text" />
        <label>Image URL</label>
        <input value="TEST55" required name="image" type="text" />
        <label>Publisher</label>
        <input value="TEST55" required name="publisher" type="text" />
        <label>Prep time</label>
        <input value="23" required name="cookingTime" type="number" />
        <label>Servings</label>
        <input value="23" required name="servings" type="number" />
      </div>

      <div class="upload__column">
        <h3 class="upload__heading">Ingredients</h3>
        <label>Ingredient 1</label>
        <input
          value="0.5,kg,Rice"
          type="text"
          required
          name="ingredient-1"
          placeholder="Format: 'Quantity,Unit,Description'"
        />
        <label>Ingredient 2</label>
        <input
          value="1,,Avocado"
          type="text"
          name="ingredient-2"
          placeholder="Format: 'Quantity,Unit,Description'"
        />
        <label>Ingredient 3</label>
        <input
          value=",,salt"
          type="text"
          name="ingredient-3"
          placeholder="Format: 'Quantity,Unit,Description'"
        />
        <label>Ingredient 4</label>
        <input
          type="text"
          name="ingredient-4"
          placeholder="Format: 'Quantity,Unit,Description'"
        />
        <label>Ingredient 5</label>
        <input
          type="text"
          name="ingredient-5"
          placeholder="Format: 'Quantity,Unit,Description'"
        />
        <label>Ingredient 6</label>
        <input
          type="text"
          name="ingredient-6"
          placeholder="Format: 'Quantity,Unit,Description'"
        />
      </div>

      <button class="btn upload__btn">
        <svg>
          <use href="src/img/${icons}#icon-upload-cloud"></use>
        </svg>
        <span>Upload</span>
      </button>
    </form>`;
  }
}

export default new AddRecipeView();
