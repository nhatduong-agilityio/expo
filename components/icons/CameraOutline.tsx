import Svg, { Path, SvgProps } from 'react-native-svg';
import { useUnistyles } from 'react-native-unistyles';

export const CameraOutline = ({
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
        d="M0 3.368c0-.464.364-.842.794-.842h14.412c.439 0 .794.375.794.842v11.79c0 .465-.364.842-.794.842H.794a.76.76 0 0 1-.305-.065.795.795 0 0 1-.258-.183.876.876 0 0 1-.23-.595V3.369Zm1.6.843v10.105h12.8V4.21H1.6Zm8 7.579a2.34 2.34 0 0 0 1.697-.74c.45-.474.703-1.117.703-1.787 0-.67-.253-1.312-.703-1.786a2.34 2.34 0 0 0-1.697-.74 2.34 2.34 0 0 0-1.697.74A2.595 2.595 0 0 0 7.2 9.263c0 .67.253 1.313.703 1.787.45.473 1.06.74 1.697.74Zm0 1.684a3.901 3.901 0 0 1-2.828-1.234A4.325 4.325 0 0 1 5.6 9.263c0-1.117.421-2.188 1.172-2.977A3.901 3.901 0 0 1 9.6 5.053c1.06 0 2.078.443 2.828 1.233S13.6 8.146 13.6 9.263a4.325 4.325 0 0 1-1.172 2.977A3.9 3.9 0 0 1 9.6 13.474ZM1.6 0h4.8v1.684H1.6V0Z"
      />
    </Svg>
  );
};
