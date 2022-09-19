import React, { PropsWithChildren, useRef } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { RECIPES } from "../../utils";
import { SharedElement } from "react-navigation-shared-element";
import { useContrastText } from "native-base";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type IHomeProps = {};

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const useLazyRef = <T extends object>(initializer: () => T) => {
  const ref = useRef<T>();
  if (ref.current === undefined) {
    ref.current = initializer();
  }
  return ref.current;
};

const Home = ({ navigation }: PropsWithChildren<IHomeProps>) => {
  const insets = useSafeAreaInsets();
  const y = useSharedValue(0);

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

      const x = 5;
      direction.value = interpolate(
        velocity.value,
        [-x, -0.1, 0, 0.1, x],
        [-1, 0, 0, 0, 1],
        Extrapolate.CLAMP
      );
    },
  });
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <AnimatedFlatList
        scrollEventThrottle={16}
        // bounces={false}
        onScroll={scrollHandler}
        data={RECIPES}
        renderItem={({ index, item }) => (
          <RecipeCard
            {...{
              index,
              y,
              item,
              direction,
              paddingTop: insets.top,
              onPress: () =>
                navigation.push("Detail", {
                  item,
                }),
            }}
          />
        )}
        keyExtractor={(item) => `${item.id}`}
        contentContainerStyle={{
          paddingTop: insets.top,
        }}
      />
    </View>
  );
};

const imageSize = 150;
const CARD_HEIGHT_RAW = 200;
const MARGIN = 15;
const CARD_HEIGHT = CARD_HEIGHT_RAW + MARGIN * 2;

var getContrast = function (hexcolor) {
  // If a leading # is provided, remove it
  if (hexcolor.slice(0, 1) === "#") {
    hexcolor = hexcolor.slice(1);
  }

  // If a three-character hexcode, make six-character
  if (hexcolor.length === 3) {
    hexcolor = hexcolor
      .split("")
      .map(function (hex) {
        return hex + hex;
      })
      .join("");
  }

  // Convert to RGB value
  var r = parseInt(hexcolor.substr(0, 2), 16);
  var g = parseInt(hexcolor.substr(2, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);

  // Get YIQ ratio
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Check contrast
  return yiq >= 128 ? "black" : "white";
};

const RecipeCard = ({
  index,
  y,
  item,
  onPress,
  direction,
  paddingTop,
}: {
  index: number;
  y: Animated.SharedValue<number>;
  item: any;
  onPress: any;
}) => {
  const { height, width } = useWindowDimensions();

  const textColor = getContrast(item.bgColor);
  const CARD_WIDTH = width * 0.9;
  // const extraOffset = 50;
  const isDisappearing = -CARD_HEIGHT - paddingTop;
  const isTop = 0 - paddingTop;
  const isBottom = height - CARD_HEIGHT - paddingTop;
  const isAppearing = height - paddingTop;

  const rotateX = useSharedValue(0);
  const imageRotateY = useSharedValue(0);
  const imageTranslateX = useSharedValue(0);
  const perspective = useSharedValue(500);

  useAnimatedReaction(
    () => {
      const position = index * CARD_HEIGHT - y.value;

      const p = interpolate(
        position,
        [isDisappearing, isTop, isBottom, isAppearing],
        [-1, 0, 0, 1],
        Extrapolate.CLAMP
      );

      return p;
    },
    (result, previous) => {
      if (Math.abs(result) >= 0.7 && Math.abs(result) <= 1) {
        rotateX.value = withSpring(0);
        imageRotateY.value = withSpring(0);
        imageTranslateX.value = withSpring(0);
      }

      if (result === -1) {
        rotateX.value = 70;
        imageRotateY.value = 45;
        imageTranslateX.value = 100;
      }

      if (result === 1) {
        rotateX.value = -70;
        imageRotateY.value = 45;
        imageTranslateX.value = 100;
      }
    }
  ),
    [y];
  const animatedStyle = useAnimatedStyle(() => {
    const position = index * CARD_HEIGHT - y.value;

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

    // const rotateX = interpolate(
    //   position,
    //   [isDisappearing, isTop, isBottom, isAppearing],
    //   [90, 0, 0, -90],
    //   Extrapolate.CLAMP
    // );

    return {
      // opacity,
      transform: [
        { perspective: perspective.value },
        // { translateX: CARD_WIDTH },
        // { rotateX: `${rotateX}deg` },
        // { translateX: -CARD_WIDTH },
        { rotateX: `${rotateX.value}deg` },
        // { translateY },
        // { scale },
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
        // { translateX: imageSize },
        { rotateY: `${imageRotateY.value}deg` },
        { translateX: imageTranslateX.value },
        // { translateX: -imageSize },
        // { translateX },
        { rotate: `${rotate}deg` },
        // { scale },
      ],
    };
  });

  return (
    <Animated.View style={[animatedStyle]}>
      <SharedElement id={`item.${item.id}.card`}>
        <Pressable
          onPress={onPress}
          style={{
            height: CARD_HEIGHT_RAW,
            width: CARD_WIDTH,
            borderRadius: 18,
            // shadowOffset: {
            //   height: 2,
            //   width: 0,
            // },
            // shadowOpacity: 0.2,
            // shadowRadius: 4,
            // shadowColor: "#000000",
            backgroundColor: item.bgColor,
            // marginBottom: 30,
            alignSelf: "center",
            marginVertical: MARGIN,
            // shadowColor: "#000",
            // shadowOffset: {
            //   width: 0,
            //   height: 3,
            // },
            // shadowOpacity: 0.29,
            // shadowRadius: 4.65,
          }}
        >
          <View style={{ flexDirection: "row", flex: 1 }}>
            <View
              style={{ flex: 1, padding: 15, justifyContent: "flex-end" }}
            ></View>
            <View style={{ flex: 1 }}></View>
          </View>
        </Pressable>
      </SharedElement>
      <SharedElement
        id={`item.${item.id}.photo`}
        style={{
          height: imageSize,
          width: imageSize,
          position: "absolute",
          zIndex: 100,
          bottom: 0,
          right: 0,
          // shadowColor: "#000",
          // shadowOffset: {
          //   width: 0,
          //   height: 3,
          // },
          // shadowOpacity: 0.29,
          // shadowRadius: 4.65,
        }}
      >
        <Animated.Image
          source={item.image}
          style={[
            animatedImageStyle,
            {
              height: imageSize,
              width: imageSize,
            },
          ]}
        />
      </SharedElement>
      <SharedElement id={`item.${item.id}.text`}>
        <View
          style={{
            height: CARD_HEIGHT * 0.5,
            width: CARD_WIDTH * 0.6,
            position: "absolute",
            left: (width - CARD_WIDTH) / 2 + 10,
            // top: CARD_HEIGHT / 2 - 40,
            zIndex: 5,
            // bottom: (CARD_HEIGHT - CARD_HEIGHT * 0.3) / 2,
            bottom: CARD_HEIGHT - CARD_HEIGHT * 0.5 - MARGIN * 2 - 30,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "600",
              color: textColor,
            }}
          >
            {item.title}
          </Text>
          <Text
            numberOfLines={4}
            style={{
              fontSize: 15,
              marginTop: 10,
              color: textColor,
              fontWeight: "300",
            }}
          >
            {item.description}
          </Text>
        </View>
      </SharedElement>
    </Animated.View>
  );

  return (
    <Animated.View style={[animatedStyle]}>
      <SharedElement
        id={`item.${item.id}.card`}
        style={{
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
        }}
      >
        <Pressable onPress={onPress} style={{ flex: 1 }}></Pressable>
      </SharedElement>
    </Animated.View>
  );
};

export { Home };
