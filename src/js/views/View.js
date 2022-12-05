import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  _defaultSuccess = 'All worked nicely!';

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.errorMessage();

    this._data = data;
    const markup = this._generateMarkup();

    //condition for previewView functionality to enable code refactoring via module
    if (!render) return markup;

    ////empty container from messages
    this._clear();
    ////insert recipe content into section
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  //DOM updating algorithm
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    //1. Create newDom stored in memory - for later elements selection & comparison
    const newDom = document.createRange().createContextualFragment(newMarkup);
    //2. Select all elements in DOM and newDom (not displayed one)
    //3. and convert 2. into Arrays to get HTML elements in array, and not a NodeList that lists all items as seperate items in array.
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    const newElements = Array.from(newDom.querySelectorAll('*'));

    //4. loop through and compare, if text in elements is diff, then replace/override curElement with newOne
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //useful method to compare node elements '.isEqualNode(elem)//true, false
      //.firstChild -> looks for NodeElements in HTML element hence here will output textContext
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue !== '' &&
        newEl.firstChild?.nodeValue !== curEl.firstChild?.nodeValue
      )
        curEl.textContent = newEl.textContent;

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `<div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  errorMessage(message = this._defaultError) {
    const markup = `<div class="error">
      <div>
      <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
              </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  succesMessage(message = this._defaultSuccess) {
    const markup = `<div class="message">
              <div>
                <svg>
                <use href="${icons}#icon-smile"></use>
                </svg>
                </div>
                <p>${message}</p>
                </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
