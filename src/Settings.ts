/** Settings that help calcuate and display the mandlebrot set */
export type Settings = {
  /** Points per side of the mandlebro viewfinder  */
  resolution: number;
  /** How many recursive calculations to do on a point to see if it goes towards infinity */
  calculations: number;

  // range of the view finder when looking at the mandle graph
  startReal: number;
  endReal: number;
  startImag: number;
  endImag:  number;

  // distance between the above range based properties
  rangeReal?: number; 
  rangeImag?: number;

  // colour tints to the graph
  hue?: number;
  color?: string;
}

export const defaultSettings: Settings = {
  resolution: 240,
  calculations: 100,

  startReal: -1.5,
  endReal: 0.5,
  startImag: -1,
  endImag: 1,

  rangeReal: 2,
  rangeImag: 2,

  hue: 215,
  color: '#2e588e'
};