import Svg, { ClipPath, Defs, G, Path, SvgProps } from 'react-native-svg';
import { useUnistyles } from 'react-native-unistyles';

export const FontSizeOutline = ({
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
      <G clipPath="url(#a)">
        <Path
          fill={color ?? theme.colors.iconPrimary}
          d="M11.246 15H4.754l-2 5H.6L7 4h2l6.4 16h-2.154l-2-5Zm-.8-2L8 6.885 5.554 13h4.892ZM21 12.535V12h2v8h-2v-.535a4 4 0 1 1 0-6.93ZM19 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h24v24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
