/** Settings that help calcuate and display the mandlebrot set */
export type Settings = {
  /** Number of initial fractals on the page  */
  density: number;
}

export const defaultSettings: Settings[] = [
  {
		density: 8
  }
]