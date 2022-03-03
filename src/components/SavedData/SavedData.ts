type collectionOfItems = string[];

export class SavedData {
  public isPlayingTrack: boolean = JSON.parse(localStorage.getItem('savedData'))?.isPlayingTrack || false;
  public isSnowfalling: boolean = JSON.parse(localStorage.getItem('savedData'))?.isSnowfalling || false;
  public selectedCards: collectionOfItems = JSON.parse(localStorage.getItem('savedData'))?.selectedCards || [];
  public selectedColors: collectionOfItems = JSON.parse(localStorage.getItem('savedData'))?.selectedColors || [];
  public selectedShapes: collectionOfItems = JSON.parse(localStorage.getItem('savedData'))?.selectedShapes || [];
  public selectedSizes: collectionOfItems = JSON.parse(localStorage.getItem('savedData'))?.selectedSizes || [];
  public selectedSorting: string = JSON.parse(localStorage.getItem('savedData'))?.selectedSorting || '';
  public selectedTreeSource: string = JSON.parse(localStorage.getItem('savedData'))?.selectedTreeSource || '../../assets/tree/1.webp';
  public selectedBackgroundSource: string = JSON.parse(localStorage.getItem('savedData'))?.selectedBackgroundSource || 'url(../../assets/bg/1.webp)';
  constructor() {}

  public checkSavedData(): void {
    console.log(JSON.parse(localStorage.getItem('savedData')));
  }

  public saveData(): void {
    localStorage.setItem('savedData', JSON.stringify(this));
  }

  public clearData(): void {
    localStorage.removeItem('savedData');
  }

  public default(): void {
    this.isSnowfalling = false;
    this.isPlayingTrack = false;
    this.selectedCards.length = 0;
    this.selectedColors.length = 0;
    this.selectedShapes.length = 0;
    this.selectedSizes.length = 0;
    this.selectedSorting = 'byNameToEnd';
    this.selectedTreeSource = '../../assets/tree/1.webp';
    this.selectedBackgroundSource = 'url(../../assets/bg/1.webp)';
  }

}