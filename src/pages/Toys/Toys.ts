import noUiSlider, { target } from 'nouislider';
import 'nouislider/dist/nouislider.css';
import './nouislider.css';
import './Toys.css';
import toysHtml from './Toys.html';
import { IComponent, SavedDataComponents, IToy } from '../../index';
import { Settings } from '../../components/Settings';

type noUiSliderInterval = (string | number)[];
type collectionOfItems = string[];

export class ToysPage extends Settings implements IComponent {
  protected sortedToys: IToy[];
  protected allToys: IToy[];
  protected rangeByQuantity: target;
  protected rangeByYear: target;
  protected toysContainer: HTMLElement;
  protected colorsParent: HTMLElement;
  protected shapesParent: HTMLElement;
  protected sizesParent: HTMLElement;
  protected toysParent: HTMLElement;
  protected rangeByYearMaxValue: HTMLElement;
  protected rangeByYearMinValue: HTMLElement;
  protected rangeByQuantityMaxValue: HTMLElement;
  protected rangeByQuantityMinValue: HTMLElement;

  constructor(dataToys: IToy[]) {
    super();
    this.minYear = this.setMinYear(dataToys);
    this.maxQuantity = this.setMaxQuantity(dataToys);
    this.allToys = [...dataToys];
  }

  public async render(): Promise<string> {
    return toysHtml;
  }

  public async after_render() {
    this.initSettings();
    this.addSettingsEventListeners();
    this.selectSorting.value = SavedDataComponents.selectedSorting.length > 0 ? SavedDataComponents.selectedSorting : 'byNameToEnd';
    this.rangeByQuantity = document.getElementById('settings__range-by-quantity');
    this.rangeByYear = document.getElementById('settings__range-by-year');
    this.toysContainer = document.querySelector('.toys-container');
    this.colorsParent = document.querySelector('.color__items');
    this.shapesParent = document.querySelector('.shape__items');
    this.sizesParent = document.querySelector('.size__items');
    this.toysParent = document.querySelector('.toys-container');

    noUiSlider.create(this.rangeByQuantity, {
      start: [0, this.maxQuantity],
      connect: true,
      margin: 1,
      step: 1,
      range: {
        min: 0,
        max: this.maxQuantity,
      },
      format: {
        to: (value) => parseInt(String(value)),
        from: (value) => parseInt(value),
      },
    });
    noUiSlider.create(this.rangeByYear, {
      start: [this.minYear, new Date().getFullYear()],
      connect: true,
      step: 1,
      margin: 1,
      range: {
        min: this.minYear,
        max: new Date().getFullYear(),
      },
      format: {
        to: (value) => parseInt(String(value)),
        from: (value) => parseInt(value),
      },
    });

    this.sortedToys = this.toFilterToysByAll(this.allToys);
    this.checkFilters('.color__item', SavedDataComponents.selectedColors, 'color');
    this.checkFilters('.shape__item', SavedDataComponents.selectedShapes, 'shape');
    this.checkFilters('.setting__size-label', SavedDataComponents.selectedSizes, 'size');
    this.rangeByYearMaxValue = document.querySelector('.range-by-year-results__right');
    this.rangeByYearMinValue = document.querySelector('.range-by-year-results__left');
    this.rangeByQuantityMaxValue = document.querySelector('.range-by-quantity-results__right');
    this.rangeByQuantityMinValue = document.querySelector('.range-by-quantity-results__left');

    this.rangeByYear.noUiSlider?.on('update', (values) => {
      this.rangeByYearMaxValue.innerHTML = values[1].toString();
      this.rangeByYearMinValue.innerHTML = values[0].toString();
      this.handleInput();
    });
    this.rangeByQuantity.noUiSlider?.on('update', (values) => {
      this.rangeByQuantityMaxValue.innerHTML = values[1].toString();
      this.rangeByQuantityMinValue.innerHTML = values[0].toString();
      this.handleInput();
    });
    this.colorsParent.addEventListener('click', (): void => this.handleFilter(event!, '.color__item', this.colorsParent, SavedDataComponents.selectedColors));
    this.shapesParent.addEventListener('click', (): void => this.handleFilter(event!, '.shape__item', this.shapesParent, SavedDataComponents.selectedShapes));
    this.sizesParent.addEventListener('click', (): void => this.handleFilter(event!, '.setting__size-label', this.sizesParent, SavedDataComponents.selectedSizes));
    this.toysParent.addEventListener('click', (): void => this.handleFilter(event!, '.toys-element', this.toysParent, SavedDataComponents.selectedCards));
    this.onlyFavoriteBtn.addEventListener('click', (): void => this.handleInput());
    this.showAllBtn.addEventListener('click', (): void => this.handleInput());
    this.selectSorting.addEventListener('change', (): void => {
      SavedDataComponents.selectedSorting = this.selectSorting.value;
      SavedDataComponents.saveData();
      this.showToys(this.sortedToys);
    });
    this.searchInput.addEventListener('keyup', (): void => this.handleInput());
    this.resetFiltersBtn.addEventListener('click', () => this.resetFilters());
    this.resetSettingsBtn.addEventListener('click', () => this.resetFilters());
  }
  
  protected toSortToys(value: string, array: IToy[]): IToy[] {
    switch (value) {
      case 'byNameToEnd':
        array.sort((a, b) => (a.name > b.name ? 1 : -1));
        break;
      case 'byNameToStart':
        array.sort((a, b) => (a.name < b.name ? 1 : -1));
        break;
      case 'byQuantityToMax':
        array.sort((a, b) => (+a.count > +b.count ? 1 : -1));
        break;
      case 'byQuantityToMin':
        array.sort((a, b) => (+a.count < +b.count ? 1 : -1));
        break;
      case 'byYearToMax':
        array.sort((a, b) => (+a.year > +b.year ? 1 : -1));
        break;
      case 'byYearToMin':
        array.sort((a, b) => (+a.year < +b.year ? 1 : -1));
        break;
    }
    return array;
  }

  protected addToyElement(toy: IToy): string {
    const code = `
      <p class="toys-element__name" data-num="${toy.num}">${toy.name}</p>
      <div class="toys-element__img"></div>
      <ul class="toys-element__params">
        <li class="toys-element__param">Quantity: <span class="toys-element__quantity">${toy.count}</span></li>
        <li class="toys-element__param">Year: <span class="toys-element__year">${toy.year}</span></li>
        <li class="toys-element__param">Shape: <span class="toys-element__shape">${toy.shape}</span></li>
        <li class="toys-element__param">Color: <span class="toys-element__color">${toy.color}</span></li>
        <li class="toys-element__param">Size: <span class="toys-element__size">${toy.size}</span></li>
        <li class="toys-element__param">Favorite: <span class="toys-element__favorite">${
          toy.favorite ? 'yes' : 'no'
        }</span></li>
      </ul>`;
    return code;
  }

  protected collectSelectedItems(
    selector: string,
    collector: collectionOfItems,
    item: HTMLElement
  ): collectionOfItems {
    switch (selector) {
      case '.color__item':
        if (item.classList.contains('active')) {
          collector.push(item.dataset.color!);
        } else {
          const index = collector.indexOf(item.dataset.color!);
          collector.splice(index, 1);
        }
        break;
      case '.shape__item':
        if (item.classList.contains('active')) {
          collector.push(item.dataset.shape!);
        } else {
          const index = collector.indexOf(item.dataset.shape!);
          collector.splice(index, 1);
        }
        break;
      case '.setting__size-label':
        if (item.classList.contains('active')) {
          collector.push(item.dataset.size!);
        } else {
          const index = collector.indexOf(item.dataset.size!);
          collector.splice(index, 1);
        }
        break;
      case '.toys-element':
        const numCarrier = item.firstElementChild as HTMLElement;
        if (item.classList.contains('active')) {
          collector.push(numCarrier.dataset.num!);
        } else {
          const index = collector.indexOf(numCarrier.dataset.num!);
          collector.splice(index, 1);
        }
        break;
    }
    return Array.from(new Set(collector));
  }

  protected toDelegateEvent(
    event: Event,
    selector: string,
    element: HTMLElement,
    collector: collectionOfItems
  ): collectionOfItems {
    const item = (event.target as HTMLElement).closest(selector) as HTMLElement;
    if (!item || !element.contains(item)) return collector;
    item.classList.toggle('active');
    collector = this.collectSelectedItems(selector, collector, item);
    return collector;
  }

  protected checkFilters(selector: string, collector: collectionOfItems, attribute: string) {
    const array = document.querySelectorAll(selector);
    array.forEach((item) => {
      if (item instanceof HTMLElement) {
        if (collector.includes(item.dataset[attribute]!)) {
          if (item.previousElementSibling?.classList.contains('setting__input')) {
            const input = item.previousElementSibling as HTMLInputElement;
            input.checked = true;
          } else item.classList.add('active');
        } else if (item.previousElementSibling?.classList.contains('setting__input')) {
          const input = item.previousElementSibling as HTMLInputElement;
          input.checked = false;
        } else item.classList.remove('active');
      }
    });
  }

  protected showToys(array: IToy[]): void {
    this.toysContainer.innerHTML = '';
    this.toSortToys(this.selectSorting.value, array);
    array.forEach((item) => {
      const div = document.createElement('div');
      div.classList.add('toys-element');
      if (SavedDataComponents.selectedCards.includes(item.num.toString())) {
        div.classList.add('active');
      }
      div.innerHTML = this.addToyElement(item);
      const img = div.querySelector('.toys-element__img') as HTMLElement;
      img.style.backgroundImage = `url('../../assets/toys/${item.num}.webp')`;
      this.toysContainer.append(div);
    });
    if (array.length === 0) {
      this.toysContainer.innerHTML = 'Nothing found. Try another search query';
      this.toysContainer.style.fontSize = '3rem';
    }
  }
  
  protected resetFilters(): void {
    this.rangeByYear.noUiSlider?.set([this.minYear, new Date().getFullYear()]);
    this.rangeByQuantity.noUiSlider?.set([0, this.maxQuantity]);
    this.showAllBtn.checked = false;
    this.onlyFavoriteBtn.checked = false;
    SavedDataComponents.selectedColors.length = 0;
    SavedDataComponents.selectedShapes.length = 0;
    SavedDataComponents.selectedSizes.length = 0;
    this.searchInput.value = '';
    this.checkFilters('.color__item', SavedDataComponents.selectedColors, 'color');
    this.checkFilters('.shape__item', SavedDataComponents.selectedShapes, 'shape');
    this.checkFilters('.setting__size-label', SavedDataComponents.selectedSizes, 'size');
    this.sortedToys = this.toSortToys(this.selectSorting.value, this.allToys);
    this.showToys(this.sortedToys);
  }

  protected toFilterToysByAll(array: IToy[]): IToy[] {
    if (this.showAllBtn.checked.valueOf()) {
      return array;
    }
    if (this.searchInput.value.length > 0) array = this.toFilterToysByName(this.searchInput, array);
    array = this.toFilterToysByYear(this.rangeByYear.noUiSlider?.get() as noUiSliderInterval, array);
    array = this.toFilterToysByQuantity(this.rangeByQuantity.noUiSlider?.get() as noUiSliderInterval, array);
    if (SavedDataComponents.selectedColors.length > 0) array = this.toFilterToysByColor(SavedDataComponents.selectedColors, array);
    if (SavedDataComponents.selectedShapes.length > 0) array = this.toFilterToysByShape(SavedDataComponents.selectedShapes, array);
    if (SavedDataComponents.selectedSizes.length > 0) array = this.toFilterToysBySize(SavedDataComponents.selectedSizes, array);
    if (this.onlyFavoriteBtn.checked.valueOf()) array = this.toFilterToysOnlyFavorite(this.onlyFavoriteBtn, array);
    return array; 
  }

  protected toFilterToysByYear(interval: noUiSliderInterval, array: IToy[]): IToy[] {
    return array.filter((item) => +item.year >= +interval[0] && +item.year <= +interval[1]);
  }

  protected toFilterToysByQuantity(interval: noUiSliderInterval, array: IToy[]): IToy[] {
    return array.filter((item) => +item.count >= +interval[0] && +item.count <= +interval[1]);
  }

  protected toFilterToysByColor(colors: collectionOfItems, array: IToy[]): IToy[] {
    return array.filter((item) => colors.includes(item.color));
  }

  protected toFilterToysByShape(shapes: collectionOfItems, array: IToy[]): IToy[] {
    return array.filter((item) => shapes.includes(item.shape));
  }

  protected toFilterToysBySize(sizes: collectionOfItems, array: IToy[]): IToy[] {
    return array.filter((item) => sizes.includes(item.size));
  }

  protected toFilterToysOnlyFavorite(element: HTMLInputElement, array: IToy[]): IToy[] {
    return array.filter((item) => item.favorite == element.checked.valueOf());
  }

  protected toFilterToysByName(element: HTMLInputElement, array: IToy[]): IToy[] {
    return array.filter((item) => item.name.toLowerCase().trim().includes(element.value.trim().toLowerCase()));
  }

  protected handleFilter(
    event: Event,
    selector: string,
    element: HTMLElement,
    collector: collectionOfItems): void
    {
    collector = this.toDelegateEvent(event, selector, element, collector);
    SavedDataComponents.saveData();
    this.sortedToys = this.toFilterToysByAll(this.allToys);
    this.showToys(this.sortedToys);
  }

  protected handleInput() {
    this.sortedToys = this.toFilterToysByAll(this.allToys);
    this.showToys(this.sortedToys);
  }

}
