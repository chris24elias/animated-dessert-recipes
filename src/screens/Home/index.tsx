import React, { PropsWithChildren, useRef } from "react";
import {
  FlatList,
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
  useSharedValue,
  withDelay,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import { RECIPES } from "../../utils/data";
import { SharedElement } from "react-navigation-shared-element";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getContrast, getTranslateZ } from "../../utils";

export type IHomeProps = {
  navigation: any;
};

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const Home = ({ navigation }: PropsWithChildren<IHomeProps>) => {
  const insets = useSafeAreaInsets();
  const y = useSharedValue(0);

  const direction = useSharedValue(0);
  // const velocity = useSharedValue(0);
  // const scrollHandler = useAnimatedScrollHandler<{ y?: number }>({
  //   onEndDrag: () => {
  //     direction.value = 0;
  //   },
  //   onScroll: (event, ctx) => {
  //     const dy = event.contentOffset.y - (ctx?.y ?? 0);
  //     direction.value = Math.sign(dy);

  //     //// velocity
  //     const now = new Date().getTime();
  //     const dt = now - ctx.time;
  //     const dyy = event.contentOffset.y - ctx.y;
  //     velocity.value = dyy / dt;
  //     ctx.time = now;

  //     ///
  //     ctx.y = event.contentOffset.y;
  //     y.value = event.contentOffset.y;

  //     const x = 5;
  //     direction.value = interpolate(
  //       velocity.value,
  //       [-x, -0.1, 0, 0.1, x],
  //       [-1, 0, 0, 0, 1],
  //       Extrapolate.CLAMP
  //     );
  //   },
  // });

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
  direction: Animated.SharedValue<number>;
  paddingTop: number;
}) => {
  const { height, width } = useWindowDimensions();

  const textColor = getContrast(item.bgColor);
  const CARD_WIDTH = width * 0.9;

  const isDisappearing = -CARD_HEIGHT - paddingTop;
  const isTop = 0 - paddingTop;
  const isBottom = height - CARD_HEIGHT - paddingTop;
  const isAppearing = height - paddingTop;

  const rotateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const imageRotateY = useSharedValue(0);
  const imageTranslateX = useSharedValue(0);

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
    (result) => {
      const config: WithSpringConfig = {
        damping: 15,
        mass: 1.2,
        stiffness: 80,
      };

      if (Math.abs(result) >= 0.7 && Math.abs(result) <= 1) {
        rotateX.value = withSpring(0, config);
        imageRotateY.value = withDelay(75, withSpring(0));
        imageTranslateX.value = withDelay(75, withSpring(0));
        scale.value = withSpring(1, config);
      }

      if (result === -1) {
        rotateX.value = 70;
        imageRotateY.value = 45;
        imageTranslateX.value = 100;
        scale.value = getTranslateZ(CARD_HEIGHT, -200);
      }

      if (result === 1) {
        rotateX.value = -70;
        imageRotateY.value = 45;
        imageTranslateX.value = 100;
        scale.value = getTranslateZ(CARD_HEIGHT, -100);
      }
    }
  ),
    [y];
  const animatedStyle = useAnimatedStyle(() => {
    const perspective = CARD_HEIGHT;

    // const offset = interpolate(
    //   direction.value,
    //   [-1, 0, 1],
    //   [CARD_HEIGHT / 2, 0, -CARD_HEIGHT / 2]
    // );

    return {
      transform: [
        { perspective: perspective },

        // ...transformOrigin({ x: 0, y: offset }, [
        //   { rotateX: `${rotateX.value}deg` },
        // ]),
        { rotateX: `${rotateX.value}deg` },
        { scale: scale.value },
      ],
    };
  });

  const animatedImageStyle = useAnimatedStyle(() => {
    // const position = index * CARD_HEIGHT - y.value;

    // const rotate = interpolate(
    //   position,
    //   [isDisappearing, isTop, isBottom, isAppearing],
    //   [45, 0, 0, -45],
    //   Extrapolate.CLAMP
    // );

    return {
      transform: [
        { perspective: imageSize },
        { rotateY: `${imageRotateY.value}deg` },
        { translateX: imageTranslateX.value },
        // { rotate: `${rotate}deg` },
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

            backgroundColor: item.bgColor,

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
            height: CARD_HEIGHT * 0.5,
            width: CARD_WIDTH * 0.6,
            position: "absolute",
            left: (width - CARD_WIDTH) / 2 + 10,
            zIndex: 5,
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
};

export { Home };
