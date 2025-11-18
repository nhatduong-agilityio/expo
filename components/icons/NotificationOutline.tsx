import Svg, { Path, SvgProps } from 'react-native-svg';
import { useUnistyles } from 'react-native-unistyles';

export const NotificationOutline = ({
  color,
  width = 24,
  height = 24,
  ...props
}: SvgProps) => {
  const { theme } = useUnistyles();

  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <Path
        fill={color ?? theme.colors.iconPrimary}
        d="M5.778 16.395h12.444v-5.834c0-3.251-2.786-5.887-6.222-5.887-3.436 0-6.222 2.636-6.222 5.887v5.834ZM12 3c4.418 0 8 3.385 8 7.56v7.51H4v-7.51C4 6.386 7.582 3 12 3ZM9.778 18.907h4.444c0 .555-.234 1.087-.65 1.48A2.294 2.294 0 0 1 12 21c-.59 0-1.155-.22-1.571-.613a2.033 2.033 0 0 1-.651-1.48Z"
      />
    </Svg>
  );
};
