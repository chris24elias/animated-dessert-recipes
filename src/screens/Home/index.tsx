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
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { RECIPES } from "../../utils";
import { SharedElement } from "react-navigation-shared-element";
import { useContrastText } from "native-base";

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
  const y = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    y.value = event.contentOffset.y;
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
              onPress: () =>
                navigation.push("Detail", {
                  item,
                }),
            }}
          />
        )}
        keyExtractor={(item) => `${item.id}`}
        contentContainerStyle={
          {
            // paddingTop: 15,
          }
        }
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
}: {
  index: number;
  y: Animated.SharedValue<number>;
  item: any;
  onPress: any;
}) => {
  const { height, width } = useWindowDimensions();

  const textColor = getContrast(item.bgColor);
  console.log("TEXT COLOR", item.bgColor, textColor);
  const CARD_WIDTH = width * 0.9;
  const extraOffset = 50;
  const isDisappearing = -CARD_HEIGHT;
  const isTop = 0 - extraOffset;
  const isBottom = height - CARD_HEIGHT - extraOffset;
  const isAppearing = height;

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
    // if (index === 1) {
    //   console.log({ position, translateY, isAppearing, isDisappearing });
    // }

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

    const rotateX = interpolate(
      position,
      [isDisappearing, isTop, isBottom, isAppearing],
      [90, 0, 0, -90],
      Extrapolate.CLAMP
    );

    return {
      // opacity,
      transform: [
        { perspective: 1000 },
        { translateX: CARD_WIDTH },
        { rotateX: `${rotateX}deg` },
        { translateX: -CARD_WIDTH },
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
            height: undefined, // CARD_HEIGHT * 0.3,
            width: CARD_WIDTH * 0.55,
            position: "absolute",
            left: (width - CARD_WIDTH) / 2 + 10,
            // top: CARD_HEIGHT / 2 - 40,
            bottom: 25,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: textColor,
            }}
          >
            {item.title}
          </Text>
          <Text
            numberOfLines={3}
            style={{
              fontSize: 14,
              marginTop: 10,
              color: textColor,
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
