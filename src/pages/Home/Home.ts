import './Home.css';
import HomePage from './Home.html';
import { IComponent } from '../../index';
import { SettingsCommon } from '../../components/SettingsCommon';

export class Home extends SettingsCommon implements IComponent {
  constructor() {
    super();
  }

  public async render() {
    return HomePage;
  }

  public async after_render() {
    this.initCommonSettings();
  }
}
