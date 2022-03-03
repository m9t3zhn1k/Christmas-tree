import { SavedDataComponents } from '../../index';

export class SettingsCommon {
  public snowflakesArea?: HTMLElement;
  constructor() {}

  public initCommonSettings() {
    this.snowflakesArea = document.querySelector('.body__snowflakes');
    if (SavedDataComponents.isSnowfalling) {
      this.snowflakesArea?.classList.add('active');
    }
  }
}