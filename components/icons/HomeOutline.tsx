import Svg, { ClipPath, Defs, G, Path, SvgProps } from 'react-native-svg';
import { useUnistyles } from 'react-native-unistyles';

export const HomeOutline = ({
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
          d="M13 19h6V9.978l-7-5.444-7 5.444V19h6v-6h2v6Zm8 1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.49a1 1 0 0 1 .386-.79l8-6.222a1 1 0 0 1 1.228 0l8 6.222a1 1 0 0 1 .386.79V20Z"
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
