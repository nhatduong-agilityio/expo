import Svg, { ClipPath, Defs, G, Path, SvgProps } from 'react-native-svg';
import { useUnistyles } from 'react-native-unistyles';

export const CompassFilled = ({
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
          d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Zm3.5-13.5-5 2-2 5 5-2 2-5Z"
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
