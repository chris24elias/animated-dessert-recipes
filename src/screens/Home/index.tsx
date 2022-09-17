import React, { PropsWithChildren, useRef } from "react";
import { FlatList, Image, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
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

  const scrollHandler = useAnimatedScrollHandler((event) => {
    y.value = event.contentOffset.y;
  });
  return (
    <AnimatedFlatList
      scrollEventThrottle={16}
      // bounces={false}
      onScroll={scrollHandler}
      data={RECIPES}
      renderItem={({ index, item }) => <RecipeCard {...{ index, y, item }} />}
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
  item,
}: {
  index: number;
  y: Animated.SharedValue<number>;
  item: any;
}) => {
  const { height } = useWindowDimensions();

  const animatedStyle = useAnimatedStyle(() => {
    const position = index * CARD_HEIGHT - y.value;
    const isDisappearing = -CARD_HEIGHT;
    const isTop = 0;
    const isBottom = height - CARD_HEIGHT;
    const isAppearing = height;

    const a =
      y.value +
      interpolate(
        y.value,
        [0, 0.00001 + index * CARD_HEIGHT],
        [0, -index * CARD_HEIGHT],
        Extrapolate.CLAMP
      );

    const b = interpolate(
      position,
      [isBottom, isAppearing],
      [0, -CARD_HEIGHT / 4],
      Extrapolate.CLAMP
    );

    const translateY = a + b;
    if (index === 1) {
      console.log({ position, translateY, isAppearing, isDisappearing });
    }

    const scale = interpolate(
      position,
      [isDisappearing, isTop, isBottom, isAppearing],
      [0.5, 1, 1, 0.5],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      position,
      [isDisappearing, isTop, isBottom, isAppearing],
      [0.5, 1, 1, 0.5]
    );

    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          height: CARD_HEIGHT_RAW,
          width: "90%",
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
              fontSize: 9,
              marginTop: 10,
            }}
          >
            {item.description}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Image
            source={item.image}
            style={{
              height: imageSize,
              width: imageSize,
              position: "absolute",
              zIndex: 100,
              bottom: "-8%",
              right: "-10%",
            }}
          />
        </View>
      </View>
    </Animated.View>
  );
};

export { Home };