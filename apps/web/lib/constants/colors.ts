export type Color = {
  disabled: string;
  bullish: string;
  bearish: string;
  bullishDisabled: string;
  bearishDisabled: string;
};

const LIGHT_COLORS: Color = {
  disabled: '#000',
  bullish: '#00ff00',
  bearish: '#ff0000',
  bullishDisabled: '#00ff0025',
  bearishDisabled: '#ff000025',
};

const DARK_COLORS: Color = {
  disabled: '#fff',
  bullish: '#00ff00',
  bearish: '#ff0000',
  bullishDisabled: '#00ff0025',
  bearishDisabled: '#ff000025',
};

export function getColor(isLight: boolean, type: keyof Color) {
  const colors = isLight ? LIGHT_COLORS : DARK_COLORS;
  return colors[type];
}
