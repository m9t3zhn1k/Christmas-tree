import treeHtml from './Tree.html';
import './Tree.css';
import { IComponent, SavedDataComponents, IToy } from '../../index';
import { Settings } from '../../components/Settings';

export class TreePage extends Settings implements IComponent {
  protected treeImage: HTMLImageElement;
  protected treePlayground: HTMLElement;
  protected garlandContainer: HTMLElement;
  protected treesContainter: HTMLElement;
  protected backgroundsContainter: HTMLElement;
  protected toysContainter: HTMLElement;
  protected garlandButtonsParent: HTMLElement;
  protected garlandButtons: NodeListOf<HTMLElement>;
  protected area: HTMLElement;
  protected allToys: IToy[];
  protected get quantityOfTrees(): number {
    return 6;
  }
  protected get quantityOfBackgrounds(): number {
    return 10;
  } 
  protected get quantityOfToys(): number {
    return 20;
  }
  constructor(dataToys: IToy[]) {
    super();
    this.allToys = [...dataToys];
  }

  public async render() {
    return treeHtml;
  }

  public async after_render() {
    
    this.treesContainter = document.querySelector('.select-tree__items');
    this.backgroundsContainter = document.querySelector('.select-background__items');
    this.toysContainter = document.querySelector('.select-toys__items');
    this.garlandButtonsParent = document.querySelector('.garland__items');
    this.treeImage = document.querySelector('.tree__image');
    this.treeImage.src = SavedDataComponents.selectedTreeSource;
    this.treePlayground = document.querySelector('.tree');
    this.treePlayground.style.backgroundImage = SavedDataComponents.selectedBackgroundSource;
    this.garlandContainer = document.querySelector('.garland-container');
    this.garlandButtons = document.querySelectorAll('.garland__item');
    this.area = document.getElementById('tree__area');

    this.initSettings();
    this.addSettingsEventListeners();
    this.createToyContainerContent();
    this.createBackgroundContainerContent();
    this.createTreesContainerContent();

    this.treesContainter.addEventListener('click', () => this.selectTree(event!, '.select-tree__item', this.treesContainter));
    this.backgroundsContainter.addEventListener('click', () => this.selectBackground(event!, '.select-background__item', this.backgroundsContainter));
    this.garlandButtonsParent.addEventListener('click', (event) => {
      const item = (event.target as HTMLElement).closest('.garland__item') as HTMLInputElement;
      if (!item || !this.garlandButtonsParent.contains(item)) return;
      item.classList.toggle('active');
      this.garlandButtons.forEach(button => button !== item ? button.classList.remove('active') : button);
      this.addGarland(item);
    });
    this.toysContainter.addEventListener('mousedown', () => this.moveToyFromToyContainer(event, this.area));
    this.area.firstElementChild.addEventListener('mousedown', () => this.moveToyFromTreeContainer(event, this.toysContainter, this.area));
    this.resetSettingsBtn.addEventListener('click', () => this.resetOptions());
  }

  protected createToyContainerContent() {
    for (let i = 0; i < this.quantityOfToys; i++) {
      const div = document.createElement('div');
      const img = document.createElement('img');
      const count = document.createElement('p');
      let index: number;
      div.classList.add('select-toys__item');
      img.classList.add('select-toys__item-image', 'draggable');
      count.classList.add('select-toys__item-counter');
      if (SavedDataComponents.selectedCards.length > 0) {
        if (SavedDataComponents.selectedCards[i]) {
          img.src = `../../assets/toys/${SavedDataComponents.selectedCards[i]}.webp`;
          div.append(img);
          div.append(count);
          index = +SavedDataComponents.selectedCards[i] - 1;
          count.innerHTML = `${this.allToys[index].count}`;
          div.dataset.type = this.allToys[index].num;
          img.dataset.type = this.allToys[index].num;
        }
      } else {
        img.src = `../../assets/toys/${i + 1}.webp`;
        div.append(img);
        div.append(count);
        index = i;
        count.innerHTML = `${this.allToys[index].count}`;
        div.dataset.type = this.allToys[index].num;
        img.dataset.type = this.allToys[index].num;
      }
      this.toysContainter.append(div);
    }
  }

  protected createBackgroundContainerContent() {
    for (let i = 1; i <= this.quantityOfBackgrounds; i++) {
      const div = document.createElement('div');
      div.classList.add('select-background__item');
      div.style.backgroundImage = `url(../../assets/bg/${i}.webp)`;
      this.backgroundsContainter.append(div);
    }
  }

  protected createTreesContainerContent() {
    for (let i = 1; i <= this.quantityOfTrees; i++) {
      const div = document.createElement('div');
      div.classList.add('select-tree__item');
      div.style.backgroundImage = `url(../../assets/tree/${i}.webp)`;
      this.treesContainter.append(div);
    }
  }

  protected resetOptions() {
    this.treePlayground.style.backgroundImage = SavedDataComponents.selectedBackgroundSource;
    this.treeImage.src = SavedDataComponents.selectedTreeSource;
    this.garlandButtons.forEach(button => this.resetGarland(button));
    this.toysContainter.innerHTML = '';
    this.area.firstElementChild.innerHTML = '';
    this.createToyContainerContent();
  }

  protected moveToyFromToyContainer = (event: Event, area: HTMLElement): void => {
    const item = (event.target as HTMLElement).closest('.draggable') as HTMLImageElement;
    if (!item || !this.toysContainter.contains(item)) return;
    const parent = item.parentElement;
    const itemCounter = parent.querySelector('.select-toys__item-counter');
    let itemCounterValue = +itemCounter.innerHTML;
    let isAboveTreeArea = false;
    let xCoord: number;
    let yCoord: number;
    item.ondragstart = function() {
      return false;
    };
    let shiftX = (event as MouseEvent).clientX - item.getBoundingClientRect().left;
    let shiftY = (event as MouseEvent).clientY - item.getBoundingClientRect().top;
    if (itemCounterValue > 1) {
      const copyElement = item.cloneNode() as HTMLImageElement;
      parent.prepend(copyElement);
    }
    item.style.zIndex = '1000';
    item.style.position = 'absolute';
    document.body.append(item);
    if (event instanceof MouseEvent) {
      this.moveAt(event.pageX, event.pageY, shiftX, shiftY, item);
    }
    const onMouseMove = (event: Event): boolean => {
      if (event instanceof MouseEvent) {
        this.moveAt(event.pageX, event.pageY, shiftX, shiftY, item);
        xCoord = event.pageX;
        yCoord = event.pageY;
        item.hidden = true;
        let droppableBelow = document.elementFromPoint(event.clientX, event.clientY)?.closest('#tree__area');
        item.hidden = false;
        if (this.area == droppableBelow as HTMLElement) {
          isAboveTreeArea = true;
          item.style.cursor = 'pointer';
        } else {
          isAboveTreeArea = false;
          item.style.cursor = 'not-allowed';
        }
        return isAboveTreeArea;
      }
    }
    document.addEventListener('mousemove', onMouseMove);
    item.onmouseup = function() {
      if (!isAboveTreeArea) {
        item.removeAttribute('style');
        itemCounterValue > 1 ? document.body.removeChild(item) : parent.prepend(item);
      } else {
        if (event instanceof MouseEvent) {
          item.style.removeProperty('cursor');
          item.style.left = xCoord - area.firstElementChild.getBoundingClientRect().left - shiftX + 'px';
          item.style.top = yCoord - area.firstElementChild.getBoundingClientRect().top - shiftY + 'px';
        }
        area.firstElementChild.append(item);
        itemCounter.innerHTML = String(--itemCounterValue);
      }
      document.removeEventListener('mousemove', onMouseMove);
      item.onmouseup = null;
    };
  }

  protected moveToyFromTreeContainer(event: Event, container: HTMLElement, area: HTMLElement): void {
    const item = (event.target as HTMLElement).closest('.draggable') as HTMLImageElement;
    if (!item || !this.area.firstElementChild.contains(item)) return;
    let isAboveTreeArea = false;
    let xCoord: number;
    let yCoord: number;
    item.ondragstart = function() {
      return false;
    };
    let shiftX = (event as MouseEvent).clientX - item.getBoundingClientRect().left;
    let shiftY = (event as MouseEvent).clientY - item.getBoundingClientRect().top;
    item.style.height = item.clientHeight + 'px';
    item.style.width = item.clientWidth + 'px';
    item.style.zIndex = '1000';
    item.style.position = 'absolute';
    document.body.append(item);
    if (event instanceof MouseEvent) {
      this.moveAt(event.pageX, event.pageY, shiftX, shiftY, item);
    }
    const onMouseMove = (event: Event): boolean => {
      if (event instanceof MouseEvent) {
        this.moveAt(event.pageX, event.pageY, shiftX, shiftY, item);
        xCoord = event.pageX;
        yCoord = event.pageY;
        item.hidden = true;
        let droppableBelow = document.elementFromPoint(event.clientX, event.clientY)?.closest('#tree__area');
        item.hidden = false;
        if (this.area == droppableBelow as HTMLElement) {
          isAboveTreeArea = true;
          item.style.cursor = 'pointer';
        } else {
          isAboveTreeArea = false;
          item.style.cursor = 'not-allowed';
        }
        return isAboveTreeArea;
      }
    }
    document.addEventListener('mousemove', onMouseMove);
    item.onmouseup = function() {
      if (!isAboveTreeArea) {
        item.removeAttribute('style');
        const parent = container.querySelector(`div[data-type='${item.dataset.type}']`);
        const itemCounter = parent.querySelector('.select-toys__item-counter');
        let itemCounterValue = +itemCounter.innerHTML;
        if (itemCounterValue > 0) {
          document.body.removeChild(item);
        } else {
          parent.prepend(item);
        }
        itemCounter.innerHTML = String(++itemCounterValue);
      } else {
        if (event instanceof MouseEvent) {
          item.style.removeProperty('cursor');
          item.style.left = xCoord - area.firstElementChild.getBoundingClientRect().left - shiftX + 'px';
          item.style.top = yCoord - area.firstElementChild.getBoundingClientRect().top - shiftY + 'px';
        }
        area.firstElementChild.append(item);
      }
      document.removeEventListener('mousemove', onMouseMove);
      item.onmouseup = null;
    };
  }

  protected addGarland(element: HTMLElement): void {
    const garlandHeight = this.garlandContainer.clientHeight;
    const amount = Math.floor(100 / (10 + 8/garlandHeight));
    let color: string;
    while (this.garlandContainer.firstChild) {
      this.garlandContainer.removeChild(this.garlandContainer.firstChild);
    }
    if (element.classList.contains('active')) {
      for (let i = 0; i < amount; i++) {
        const lightElements = document.createElement('ul');
        lightElements.classList.add('garland-elements');
        for (let j = 0; j < 1 + i * 2; j++) {
          const lightElement = document.createElement('li');
          lightElement.classList.add('garland-element');
          const dX = Math.floor(Math.random() * 10) + 'px';
          const dY = Math.floor(Math.random() * 20) + 'px';
          const durationAnimation = (Math.random() * (3 - 1) + 1).toFixed(1);
          lightElement.style.animationDuration = durationAnimation + 's';
          if (element.dataset.color === 'multi') {
            const randomColorNumber = Math.ceil(Math.random() * 5);
            switch(randomColorNumber) {
              case 1:
                color = 'yellowgreen';
                break;
              case 2:
                color = 'red';
                break;
              case 3:
                color = 'blue';
                break;
              case 4:
                color = 'yellow';
                break;
              case 5:
                color = 'white';
                break;
              default:
                color = 'violet';
            }
          } else color = element.dataset.color;
          lightElement.style.backgroundColor = color;
          lightElement.style.boxShadow = `0px 0px 1px 2px ${color}`;
          Math.random() > 0.5 ? lightElement.style.top = dY : lightElement.style.bottom = dY;
          Math.random() > 0.5 ? lightElement.style.left = dX : lightElement.style.right = dX;
          lightElements.append(lightElement);
        }
        this.garlandContainer.append(lightElements);
      }
    }
  }

  protected resetGarland(button: HTMLElement) {
    button.classList.remove('active');
    this.addGarland(button);
  }

  protected selectBackground(
    event: Event,
    selector: string,
    element: HTMLElement
    ): void {
    const item = (event.target as HTMLElement).closest(selector) as HTMLElement;
    if (!item || !element.contains(item)) return;
    if (this.treePlayground instanceof HTMLElement) {
      this.treePlayground.style.backgroundImage = item.style.backgroundImage;
    }
    SavedDataComponents.selectedBackgroundSource = item.style.backgroundImage;
    SavedDataComponents.saveData();
  }

  protected selectTree(
    event: Event,
    selector: string,
    element: HTMLElement
    ): void {
    const item = (event.target as HTMLElement).closest(selector) as HTMLElement;
    if (!item || !element.contains(item)) return;
    if (this.treeImage instanceof HTMLImageElement) {
      this.treeImage.src = item.style.backgroundImage.split('\"')[1];
    }
    SavedDataComponents.selectedTreeSource = item.style.backgroundImage.split('\"')[1];
    SavedDataComponents.saveData();
  }

  protected moveAt(pageX: number, pageY: number, shiftX: number, shiftY: number, element: HTMLElement): void {
    element.style.left = pageX - shiftX + 'px';
    element.style.top = pageY - shiftY + 'px';
  }
}