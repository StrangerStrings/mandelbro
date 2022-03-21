/** Settings that help calcuate and display the mandlebrot set */
export type Settings = {
  /** Number of initial fractals on the page  */
  amount: number;
}

export const defaultSettings: Settings[] = [
  {
		amount: 8
  }
]