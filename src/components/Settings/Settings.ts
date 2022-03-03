import { SavedDataComponents, newYearTrack, IToy } from '../../index';
import { SettingsCommon } from '../SettingsCommon';

export class Settings extends SettingsCommon {
  protected minYear: number;
  protected maxQuantity: number;
  protected startSnowfallBtn: HTMLButtonElement;
  protected musicBtn: HTMLButtonElement;
  protected resetFiltersBtn?: HTMLElement;
  protected resetSettingsBtn: HTMLElement;
  protected onlyFavoriteBtn?: HTMLInputElement;
  protected showAllBtn?: HTMLInputElement;
  protected selectSorting?: HTMLSelectElement;
  protected searchInput?: HTMLInputElement;
  constructor() {
    super();
  }

  protected initSettings() {
    this.snowflakesArea = document.querySelector('.body__snowflakes');
    if (SavedDataComponents.isSnowfalling) {
      this.snowflakesArea?.classList.add('active');
    }
    this.startSnowfallBtn = document.querySelector('.settings__snow');
    this.musicBtn = document.querySelector('.settings__mute');
    this.resetFiltersBtn = document.getElementById('resetFiltersButton');
    this.resetSettingsBtn = document.getElementById('resetSettingsButton');
    this.onlyFavoriteBtn = <HTMLInputElement>document.getElementById('toyFavorites');
    this.showAllBtn = <HTMLInputElement>document.getElementById('showAllToys');
    this.selectSorting = document.querySelector('.sorting__select');
    this.searchInput = document.querySelector('.toys-search');
    /* if (SavedDataComponents.isPlayingTrack) {
      this.musicBtn.classList.add('active');
      if (newYearTrack.duration > 0 && newYearTrack.paused) {
        const promise = newYearTrack.play();
        newYearTrack.volume = 0.03;
        newYearTrack.loop = true;

        if (promise !== undefined) {
          promise.then(_ => {
            console.log('play')
          }).catch(error => {
            console.log(error);
          });
        }
      }
    } */
    if (SavedDataComponents.isSnowfalling) {
      this.startSnowfallBtn.classList.add('active');
      this.snowflakesArea?.classList.add('active');
    }
  }

  protected addSettingsEventListeners() {
    this.startSnowfallBtn.addEventListener('click', () => this.startSnowfall());
    this.musicBtn.addEventListener('click', () => this.startMusic());
    this.resetSettingsBtn.addEventListener('click', () => this.resetSettings());
  }

  protected startSnowfall() {
    this.snowflakesArea.classList.toggle('active');
    this.startSnowfallBtn.classList.toggle('active');
    SavedDataComponents.isSnowfalling = this.startSnowfallBtn.classList.contains('active');
    SavedDataComponents.saveData();
  }

  protected startMusic() {
    newYearTrack.volume = 0.03;
    if (SavedDataComponents.isPlayingTrack) {
      this.stopMusic();
    } else {
      newYearTrack.play();
      SavedDataComponents.isPlayingTrack = true;
      newYearTrack.loop = true;
      this.musicBtn.classList.add('active');
    }
    SavedDataComponents.saveData();
  }

  protected stopMusic() {
    newYearTrack.pause();
    this.musicBtn.classList.remove('active');
    newYearTrack.currentTime = 0;
    SavedDataComponents.isPlayingTrack = false;
  }

  protected resetSettings(): void {
    SavedDataComponents.clearData();
    SavedDataComponents.default();
    this.snowflakesArea.classList.remove('active');
    this.startSnowfallBtn.classList.remove('active');
    if (this.onlyFavoriteBtn) this.onlyFavoriteBtn.checked = false;
    if (this.showAllBtn) this.showAllBtn.checked = false;
    this.stopMusic();
  }

  protected setMinYear(arr: IToy[]): number {
    let years = arr.map(toy => +toy.year);
    let min = Math.min.apply(null, years);
    return min;
  }

  protected setMaxQuantity(arr: IToy[]): number {
    let quantities = arr.map(toy => +toy.count);
    let max = Math.max.apply(null, quantities);
    return max;
  }
}