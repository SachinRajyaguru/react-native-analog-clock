import React, {useEffect, useState} from 'react';
import {Platform, StatusBar, View, useWindowDimensions} from 'react-native';
import {Canvas, Circle, FontStyle, Group, Line, Rect, Skia, Text, vec} from '@shopify/react-native-skia';

const DIGIT_R = 12;

function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}
function radiansToPoint(radian: number, R: number) {
  let x = 0;
  let y = 0;

  x = R * Math.cos(radian) + DIGIT_R;
  y = R * Math.sin(radian) - DIGIT_R;

  return {x: R + x, y: R - y};
}

const App = () => {
  const {width, height} = useWindowDimensions();
  const [b, setb] = useState(false);
  const [secondXY, setSecondXY] = useState({x: 0, y: 0});
  const [minuteXY, setMinuteXY] = useState({x: 0, y: 0});
  const [hourXY, setHourXY] = useState({x: 0, y: 0});

  const familyName = Platform.select({ios: 'Helvetica', default: 'serif'});
  const fontSize = 32;
  // Get the system font manager
  const fontMgr = Skia.FontMgr.System();
  // The custom font manager is available via Skia.TypefaceFontProvider.Make()
  const typeface = fontMgr.matchFamilyStyle(familyName, FontStyle.Normal);
  const font = Skia.Font(typeface, fontSize);

  const R = Math.min(width, height) / 2 - DIGIT_R;

  const Center = {
    x: R + DIGIT_R,
    y: R + DIGIT_R,
  };

  const radians = [];
  const digit_radians = [];

  for (let i = 0; i < 12; ++i) {
    radians.push(degreesToRadians(i * 30));
    digit_radians.push(degreesToRadians(-i * 30 + 60));
  }

  const drawSecondKato = () => {
    return <Line p1={vec(Center.x, Center.y)} p2={vec(secondXY.x, secondXY.y)} color="green" style="stroke" strokeWidth={4} />;
  };

  const drawMinuteNoKato = () => {
    return <Line p1={vec(Center.x, Center.y)} p2={vec(minuteXY.x, minuteXY.y)} color="skyblue" style="stroke" strokeWidth={6} />;
  };
  const drawHourKato = () => {
    return <Line p1={vec(Center.x, Center.y)} p2={vec(hourXY.x, hourXY.y)} color="orange" style="stroke" strokeWidth={8} />;
  };

  useEffect(() => {
    const intervalID = setInterval(() => {
      const now = new Date();
      const curr_second = now.getSeconds();
      const curr_minute = now.getMinutes();
      const curr_hour = now.getHours();

      const degree_for_second_hand = curr_second * 6 - 90;

      const secondxy = radiansToPoint(degreesToRadians(-degree_for_second_hand), R);

      const degree_for_minute_hand = curr_minute * 6 - 90;
      const minutexy = radiansToPoint(degreesToRadians(-degree_for_minute_hand), R);

      // const degree_for_hour_hand = curr_hour * 30 + () + (0 * 0.1);
      /**
       * curr_hour = 1 * 30
       * curr_minute = (5 * 6) / 60
       * curr_second = (0 * 60) / 3600
       */

      const degree_for_hour_hand = curr_hour * 30 + curr_minute / 2 + curr_second / 120 - 90;
      const hourxy = radiansToPoint(degreesToRadians(-degree_for_hour_hand), R);

      setSecondXY(secondxy);
      setMinuteXY(minutexy);
      setHourXY(hourxy);
    }, 1000);
    return () => {
      clearInterval(intervalID);
    };
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Canvas style={{width: width, height: width}}>
        <Group>
          {digit_radians.map((radian, index) => {
            const {x, y} = radiansToPoint(radian, R);
            let offSet = DIGIT_R;
            let offSetY = DIGIT_R;
            return <Text x={x - offSet} y={y + offSetY} text={`${index + 1}`} font={font} key={radian} />;
          })}
          {drawSecondKato()}
          {drawMinuteNoKato()}
          {drawHourKato()}
          <Circle cx={Center.x} cy={Center.y} r={10} color={'orange'} style={'fill'} />
        </Group>
      </Canvas>
    </View>
  );
};

export default App;
