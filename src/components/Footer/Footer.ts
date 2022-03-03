import FooterElement from './Footer.html';
import './Footer.css';
import { IComponent } from '../../index';

export class Footer implements IComponent {
  constructor() {}

  public async render() {
    return FooterElement;
  }

  public async after_render() {}
}
