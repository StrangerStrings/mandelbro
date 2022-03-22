/** Turn hex code into hue, copypasta from css-tricks */
export function hexToHue(hex) {
  // Convert hex to RGB first
  let r = 0, g = 0, b = 0;
  if (hex.length == 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
  } else if (hex.length == 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      hue = 0;

  if (delta == 0)
    hue = 0;
  else if (cmax == r)
    hue = ((g - b) / delta) % 6;
  else if (cmax == g)
    hue = (b - r) / delta + 2;
  else
    hue = (r - g) / delta + 4;

  hue = Math.round(hue * 60);

  if (hue < 0)
    hue += 360;

  return hue
}