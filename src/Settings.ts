/** Settings that help calcuate and display the mandlebrot set */
export type Settings = {
  /** Number of initial fractals on the page  */
  resolution: number;

  startReal: number;
  endReal: number;
  startImag: number;
  endImag:  number;

  realDistance?: number; 
  imagDistance?: number
}

export const defaultSettings: Settings[] = [
  {
		resolution: 160,
		startReal: -1,
		endReal: 1,
		startImag: -1,
		endImag: 1,

    realDistance: 2,
    imagDistance: 2
  }
]