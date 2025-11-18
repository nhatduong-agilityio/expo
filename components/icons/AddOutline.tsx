import Svg, { Path, SvgProps } from 'react-native-svg';
import { useUnistyles } from 'react-native-unistyles';

export const AddOutline = ({
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
        stroke={color ?? theme.colors.iconPrimary}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 5v14M5 12h14"
      />
    </Svg>
  );
};
