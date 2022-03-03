import './styles/style.css';

import { Home } from './pages/Home';
import { ToysPage } from './pages/Toys';
import { TreePage } from './pages/Tree';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Utils } from './utils/Utils';
import { SavedData} from './components/SavedData';
export { SavedDataComponents, newYearTrack, IToy, IComponent };
import dataToys from './assets/data.js';

const SavedDataComponents: SavedData = new SavedData();
const homeInstance: Home = new Home();
const toysPageInstance: ToysPage = new ToysPage(dataToys);
const treePageInstance: TreePage = new TreePage(dataToys);
const headerInstance: Header = new Header();
const footerInstance: Footer = new Footer();
const newYearTrack: HTMLAudioElement = new Audio('../../assets/audio/audio.mp3');

interface IComponent {
  render(): Promise<string>;
  after_render(): void;
}

interface IToy {
  num: string;
  name: string;
  count: string;
  year: string;
  shape: string;
  color: string;
  size: string;
  favorite: boolean;
}

interface IRoute {
  [key: string]: IComponent;
}

const routes: IRoute = {
  '/': homeInstance,
  '/toys': toysPageInstance,
  '/tree': treePageInstance
};

const router = async (): Promise<void> => {
  const header = document.getElementById('header-container');
  const content = document.getElementById('app-container');
  const footer = document.getElementById('footer-container');

  header.innerHTML = await headerInstance.render();
  await headerInstance.after_render();
  footer.innerHTML = await footerInstance.render();
  await footerInstance.after_render();

  headerInstance.addToyCounterEventListener();

  const parsedURL = Utils.parseRequestURL() ? `/${Utils.parseRequestURL()}` : '/';
  
  content.innerHTML = await routes[parsedURL].render();
  await routes[parsedURL].after_render();
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
