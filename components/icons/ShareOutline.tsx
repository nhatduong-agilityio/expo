import Svg, { ClipPath, Defs, G, Path, SvgProps } from 'react-native-svg';
import { useUnistyles } from 'react-native-unistyles';

export const ShareOutline = ({
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
          d="m13.12 17.023-4.199-2.29a4 4 0 1 1 0-5.465l4.2-2.29a4 4 0 1 1 .959 1.755l-4.2 2.29a4.007 4.007 0 0 1 0 1.954l4.199 2.29a4 4 0 1 1-.959 1.755v.001ZM6 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm11-6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
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
