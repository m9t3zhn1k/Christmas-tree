import HeaderElement from './Header.html';
import './Header.css';
import { IComponent, SavedDataComponents } from '../../index';

export class Header implements IComponent {
  toysCounter: HTMLSpanElement;
  constructor() {}

  public async render() {
    return HeaderElement;
  }

  public async after_render() {
    this.toysCounter = document.getElementById('toys-counter') as HTMLSpanElement;
    this.toysCounter.innerHTML = `${SavedDataComponents.selectedCards.length}` || '0';
  }

  public addToyCounterEventListener() {
    document.body.addEventListener('click', () => this.toysCounter.innerHTML = `${SavedDataComponents.selectedCards.length}`);
  }
}
