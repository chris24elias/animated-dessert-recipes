import React, { PropsWithChildren, useRef } from "react";
import { FlatList, Image, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { RECIPES } from "../../utils";

export type IHomeProps = {};

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const useLazyRef = <T extends object>(initializer: () => T) => {
  const ref = useRef<T>();
  if (ref.current === undefined) {
    ref.current = initializer();
  }
  return ref.current;
};

const Home = ({}: PropsWithChildren<IHomeProps>) => {
  const y = useSharedValue(0);

  // const scrollHandler = useAnimatedScrollHandler((event) => {
  //   y.value = event.contentOffset.y;
  // });
  const direction = useSharedValue(0);
  const velocity = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler<{ y?: number }>({
    onEndDrag: () => {
      direction.value = 0;
    },
    onScroll: (event, ctx) => {
      const dy = event.contentOffset.y - (ctx?.y ?? 0);
      direction.value = Math.sign(dy);

      //// velocity
      const now = new Date().getTime();
      const dt = now - ctx.time;
      const dyy = event.contentOffset.y - ctx.y;
      velocity.value = dyy / dt;
      ctx.time = now;

      ///
      ctx.y = event.contentOffset.y;
      y.value = event.contentOffset.y;

      // console.log({
      //   velocity: velocity.value,
      //   direction: direction.value,
      // });
      // const x = 5;
      // direction.value = interpolate(
      //   velocity.value,
      //   [-x, -0.1, 0, 0.1, x],
      //   [-1, 0, 0, 0, 1],
      //   Extrapolate.CLAMP
      // );

      // console.log("SCROLLING", velocity.value);
    },
  });
  return (
    <AnimatedFlatList
      scrollEventThrottle={16}
      // bounces={false}
      onScroll={scrollHandler}
      data={RECIPES}
      renderItem={({ index, item }) => (
        <RecipeCard {...{ index, y, item, direction, velocity }} />
      )}
      keyExtractor={(item) => `${item.id}`}
      contentContainerStyle={
        {
          // paddingTop: 15,
        }
      }
    />
  );
};

const imageSize = 170;
const CARD_HEIGHT_RAW = 200;
const MARGIN = 15;
const CARD_HEIGHT = CARD_HEIGHT_RAW + MARGIN * 2;

const RecipeCard = ({
  index,
  y,
  direction,
  item,
  velocity,
}: {
  index: number;
  y: Animated.SharedValue<number>;
  direction: Animated.SharedValue<number>;
  velocity: Animated.SharedValue<number>;
  item: any;
}) => {
  const { height, width } = useWindowDimensions();
  const CARD_WIDTH = width * 0.9;
  const extraOffset = 50;
  const isDisappearing = -CARD_HEIGHT;
  const isTop = 0 - extraOffset;
  const isBottom = height - CARD_HEIGHT - extraOffset;
  const isAppearing = height;
  const rotateX = useSharedValue(0);

  // const x = useDerivedValue(() => {
  //   rotateX.value = withSpring(
  //     interpolate(direction.value, [-1, 0, 1], [-60, 0, 60])
  //   );
  // }, [direction]);
  const animatedStyle = useAnimatedStyle(() => {
    const position = index * CARD_HEIGHT - y.value;

    // const a =
    //   y.value +
    //   interpolate(
    //     y.value,
    //     [0, 0.00001 + index * CARD_HEIGHT],
    //     [0, -index * CARD_HEIGHT],
    //     Extrapolate.CLAMP
    //   );

    // const b = interpolate(
    //   position,
    //   [isBottom, isAppearing],
    //   [0, -CARD_HEIGHT / 4],
    //   Extrapolate.CLAMP
    // );

    // const translateY = a + b;
    // // if (index === 1) {
    // //   console.log({ position, translateY, isAppearing, isDisappearing });
    // // }

    const scale = interpolate(
      position,
      [isDisappearing, isTop, isBottom, isAppearing],
      [0.9, 1, 1, 0.9],
      Extrapolate.CLAMP
    );

    // const opacity = interpolate(
    //   position,
    //   [isDisappearing, isTop, isBottom, isAppearing],
    //   [0.5, 1, 1, 0.5]
    // );

    const rotateX = interpolate(
      position,
      [isDisappearing, isTop, isBottom, isAppearing],
      [90, 0, 0, -90],
      Extrapolate.CLAMP
    );

    // return {
    //   // opacity,
    //   transform: [
    //     { perspective: 1000 },
    //     { translateX: CARD_WIDTH },
    //     { rotateX: `${rotateX}deg` },
    //     { translateX: -CARD_WIDTH },
    //     // { translateY },
    //     // { scale },
    //   ],
    // };

    // console.log(direction.value);

    // const rotateX = interpolate(direction.value, [-1, 0, 1], [-60, 0, 60]);
    // console.log("direction.value", direction.value);
    // const scale = interpolate(
    //   direction.value,
    //   [-1, 0, 1],
    //   [0.8, 1, 0.8],
    //   Extrapolate.CLAMP
    // );

    return {
      transform: [
        { perspective: 1000 },

        // { translateY: CARD_HEIGHT },
        { rotateX: `${rotateX}deg` },
        // { translateY: -CARD_HEIGHT },
        { scale },
      ],
    };
  });

  const animatedImageStyle = useAnimatedStyle(() => {
    const position = index * CARD_HEIGHT - y.value;

    const scale = interpolate(
      position,
      [isDisappearing, isTop, isBottom, isAppearing],
      [0.8, 1, 1, 0.8],
      Extrapolate.CLAMP
    );

    const rotateY = interpolate(
      position,
      [isDisappearing, isTop, isBottom, isAppearing],
      [45, 0, 0, 45],
      Extrapolate.CLAMP
    );

    const rotate = interpolate(
      position,
      [isDisappearing, isTop, isBottom, isAppearing],
      [45, 0, 0, -45],
      Extrapolate.CLAMP
    );

    const translateX = interpolate(
      position,
      [isDisappearing, isTop, isBottom, isAppearing],
      [25, 0, 0, 25],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { perspective: 1000 },
        { translateX: imageSize },
        { rotateY: `${rotateY}deg` },
        { translateX: -imageSize },
        { translateX },
        { rotate: `${rotate}deg` },
        // { scale },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          height: CARD_HEIGHT_RAW,
          width: CARD_WIDTH,
          borderRadius: 18,
          shadowOffset: {
            height: 2,
            width: 0,
          },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          shadowColor: "#000000",
          backgroundColor: item.bgColor,
          // marginBottom: 30,
          alignSelf: "center",
          marginVertical: MARGIN,
        },
      ]}
    >
      <View style={{ flexDirection: "row", flex: 1 }}>
        <View style={{ flex: 1, padding: 15, justifyContent: "flex-end" }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "600",
            }}
          >
            {item.title}
          </Text>
          <Text
            numberOfLines={3}
            style={{
              fontSize: 12,
              marginTop: 10,
            }}
          >
            {item.description}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Animated.Image
            source={item.image}
            style={[
              animatedImageStyle,
              {
                height: imageSize,
                width: imageSize,
                position: "absolute",
                zIndex: 100,
                bottom: "-8%",
                right: "-10%",
              },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
};

export { Home };
