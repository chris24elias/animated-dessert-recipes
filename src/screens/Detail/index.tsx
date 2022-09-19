import { Box, Heading } from "native-base";
import React, { PropsWithChildren, useEffect } from "react";
import { Image, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  Extrapolate,
  FadeInDown,
  interpolate,
  SensorType,
  useAnimatedScrollHandler,
  useAnimatedSensor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SharedElement } from "react-navigation-shared-element";
import FloatingBackButton from "../../components/FloatingBackButton";
import { degreeToRad, diffClamp } from "../../utils";

export type IDetailScreenProps = {};

const DetailScreen = ({ route }: PropsWithChildren<IDetailScreenProps>) => {
  const { item } = route.params;
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const rawcardHeight = height * 0.5;
  const imageSize = 250;

  const scrollY = useSharedValue(0);

  const bgOpacity = useSharedValue(0);

  const animatedSensor = useAnimatedSensor(SensorType.ROTATION, {
    interval: 5,
  });

  useEffect(() => {
    bgOpacity.value = withDelay(500, withTiming(1));
  }, []);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
    bgOpacity.value = interpolate(
      scrollY.value,
      [0, 200],
      [1, 0],
      Extrapolate.CLAMP
    );
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: rawcardHeight - diffClamp(scrollY.value, -100, 200),
      zIndex: scrollY.value > 2 ? 2 : -2,
    };
  });

  const animatedImageStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      scrollY.value,
      [0, 280],
      [0, -180]
      // Extrapolate.CLAMP
    );

    return {
      transform: [
        {
          scale: interpolate(
            scrollY.value,
            [-100, 0, 200],
            [1.4, 1, 0.6],
            Extrapolate.CLAMP
          ),
        },
        {
          translateY: interpolate(
            scrollY.value,
            [-100, 0, 200],
            [45, 0, -170],
            Extrapolate.CLAMP
          ),
        },
        {
          rotate: `${rotate}deg`,
        },
      ],
    };
  });

  const animatedBgImageStyle = useAnimatedStyle(() => {
    const roll = animatedSensor.sensor.value.roll;
    const pitch = animatedSensor.sensor.value.pitch;

    const deg = 20;
    const rotateX = interpolate(
      pitch,
      [-Math.PI, Math.PI],
      [degreeToRad(deg), degreeToRad(-deg)],
      Extrapolate.CLAMP
    );

    const rotateY = interpolate(
      roll,
      [-Math.PI, Math.PI],
      [degreeToRad(deg), degreeToRad(-deg)],
      Extrapolate.CLAMP
    );

    // const qx = animatedSensor.sensor.value.qx;
    // const qy = animatedSensor.sensor.value.qz;
    // const translateX = withTiming(qx * 100, { duration: 50 });
    // const translateY = withTiming(qy * 100, { duration: 50 });

    return {
      opacity: bgOpacity.value,
      transform: [
        { perspective: 300 },
        { rotateY: `${rotateY}rad` },
        { rotateX: `${rotateX}rad` },
        { scale: 1 },

        // { translateX },
        // { translateY },
      ],
    };
  });

  return (
    <View style={{ flex: 1 }}>
      <FloatingBackButton />
      <Animated.View
        style={[
          {
            position: "absolute",
            width: "100%",
            borderBottomLeftRadius: 18,
            borderBottomRightRadius: 18,
          },
          animatedStyle,
        ]}
      >
        <SharedElement id={`item.${item.id}.card`}>
          <View
            style={{
              backgroundColor: item.bgColor,
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: insets.top,
              borderBottomLeftRadius: 18,
              borderBottomRightRadius: 18,
            }}
          />
        </SharedElement>
        <SharedElement
          id={`item.${item.id}.photo`}
          style={{
            height: imageSize,
            width: imageSize,
            position: "absolute",
            zIndex: 100000,
            top: rawcardHeight / 2 - imageSize / 2 + insets.top / 2,
            alignSelf: "center",
          }}
        >
          <Animated.Image
            source={item.image}
            style={[
              animatedImageStyle,
              {
                height: imageSize,
                width: imageSize,
                alignSelf: "center",
              },
            ]}
          />
        </SharedElement>
        <Animated.View
          style={[
            animatedBgImageStyle,
            {
              height: "100%",
              width: "100%",
              position: "absolute",
              zIndex: 10000,
            },
          ]}
        >
          <Animated.Image
            style={{
              height: "100%",
              width: "100%",
              alignSelf: "center",
            }}
            source={item.bgImageName}
          />
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        scrollEventThrottle={16}
        // bounces={false}
        onScroll={scrollHandler}
        contentContainerStyle={{ paddingTop: rawcardHeight }}
      >
        <SharedElement id={`item.${item.id}.text`}>
          <View
            style={{
              padding: 10,
              marginTop: 15,
            }}
          >
            <Text
              style={{
                fontSize: 26,
                fontWeight: "600",
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                fontSize: 16,
                marginTop: 10,
                fontWeight: "300",
              }}
            >
              {item.description}
            </Text>
          </View>
        </SharedElement>
        <View style={{ padding: 10 }}>
          <Heading mt="4" size="md">
            INGREDIENTS
          </Heading>

          <View style={{ marginTop: 15, paddingLeft: 10 }}>
            {item.ingredients.map((ingredient, i) => {
              return (
                <Animated.View
                  key={String(i)}
                  entering={FadeInDown.delay(150 + i * 150)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 15,
                    borderWidth: 2,
                    borderRadius: 25,
                    height: 50,
                    borderColor: item.bgColor,
                  }}
                >
                  <Box
                    style={{
                      backgroundColor: item.bgColor,
                      height: 50,
                      width: 50,
                      marginTop: -10,
                      marginLeft: -5,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    shadow="4"
                    borderRadius="full"
                  >
                    <Image
                      source={require("../../../assets/images/chef.png")}
                      style={{
                        height: 25,
                        width: 25,
                        transform: [{ rotate: "-24deg" }],
                      }}
                    />
                  </Box>
                  <Text style={{ marginLeft: 15 }}>{ingredient}</Text>
                </Animated.View>
              );
            })}
          </View>
          <Heading mt="4" size="md">
            STEPS
          </Heading>

          <View style={{ marginTop: 15, paddingLeft: 10 }}>
            {item.instructions.map((instruction, i) => {
              return (
                <Animated.View
                  key={String(i)}
                  entering={FadeInDown.delay(150 + i * 150)}
                  style={{
                    marginBottom: 25,
                    paddingRight: 15,
                    flex: 1,
                    borderWidth: 2,
                    borderRadius: 25,
                    paddingBottom: 15,
                    borderColor: item.bgColor,
                  }}
                >
                  <Box
                    style={{
                      backgroundColor: item.bgColor,
                      height: 50,
                      width: 50,
                      marginTop: -10,
                      marginLeft: -5,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    shadow="4"
                    borderRadius="full"
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        transform: [{ rotate: "-18deg" }],
                      }}
                    >
                      {i + 1}
                    </Text>
                  </Box>
                  <Text
                    style={{
                      marginLeft: 55,
                      marginTop: -10,
                      fontSize: 18,
                      lineHeight: 25,
                    }}
                  >
                    {instruction}
                  </Text>
                </Animated.View>
              );
            })}
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export { DetailScreen };
