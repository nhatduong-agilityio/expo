const bluePalette = {
  blue10: '#E8F2FF',
  blue20: '#D0E5FF',
  blue30: '#A3CCFF',
  blue40: '#75B3FF',
  blue50: '#1877F2', // Primary brand color
  blue60: '#0C63D4',
  blue70: '#084FAD',
  blue80: '#053B86',
  blue90: '#032759',
} as const;

const redPalette = {
  red10: '#FFF3F8',
  red20: '#FFE6F1',
  red30: '#FFCCE3',
  red40: '#FF84B7',
  red50: '#ED2E7E',
  red60: '#C30052',
  red70: '#9E0042',
  red80: '#7A0033',
  red90: '#560024',
} as const;

const greenPalette = {
  green10: '#F2FFFB',
  green20: '#E5FFF7',
  green30: '#CCFFEF',
  green40: '#34EAB9',
  green50: '#00BA88',
  green60: '#00966D',
  green70: '#007A59',
  green80: '#005E45',
  green90: '#004231',
} as const;

const yellowPalette = {
  yellow10: '#FFFBF0',
  yellow20: '#FFF7E0',
  yellow30: '#FFEFC2',
  yellow40: '#FFD789',
  yellow50: '#F4B740',
  yellow60: '#946200',
  yellow70: '#7A5100',
  yellow80: '#604000',
  yellow90: '#462F00',
} as const;

const greyPalette = {
  grey05: '#FAFBFC',
  grey10: '#F5F7F9',
  grey15: '#EEF1F4',
  grey20: '#E4E6EB',
  grey30: '#CED0D4',
  grey40: '#B0B3B8',
  grey50: '#8A8D91',
  grey60: '#667080',
  grey70: '#4E4B66',
  grey80: '#3A3B3C',
  grey90: '#2C2D2E',
  grey95: '#1C1E21',
} as const;

const neutralPalette = {
  white: '#FFFFFF',
  black: '#050505',
  transparent: 'transparent',
} as const;

export const palettes = {
  blue: bluePalette,
  red: redPalette,
  green: greenPalette,
  yellow: yellowPalette,
  grey: greyPalette,
  neutral: neutralPalette,
} as const;
