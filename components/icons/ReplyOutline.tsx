import Svg, { ClipPath, Defs, G, Path, SvgProps } from 'react-native-svg';
import { useUnistyles } from 'react-native-unistyles';

export const ReplyOutline = ({
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
          d="m13 20 10-8-10-8v5C7.477 9 3 13.477 3 19c0 .273.01.543.032.81a9.003 9.003 0 0 1 7.655-4.805L11 15h2v5Zm2-7h-4.034l-.347.007c-1.285.043-2.524.31-3.676.766A7.984 7.984 0 0 1 13 11h2V8.161L19.798 12 15 15.839V13Z"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M24 0H0v24h24z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
