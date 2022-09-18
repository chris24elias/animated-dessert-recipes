import { Box, Heading } from "native-base";
import React, { PropsWithChildren } from "react";
import { Image, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  Layout,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SharedElement } from "react-navigation-shared-element";
import FloatingBackButton from "../../components/FloatingBackButton";

export type IDetailScreenProps = {};

const DetailScreen = ({ route }: PropsWithChildren<IDetailScreenProps>) => {
  const { item } = route.params;
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const cardHeight = height * 0.5;

  const y = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    y.value = event.contentOffset.y;
  });

  return (
    <View style={{ flex: 1 }}>
      <FloatingBackButton />
      <Animated.ScrollView
        scrollEventThrottle={16}
        // bounces={false}
        onScroll={scrollHandler}
      >
        <SharedElement id={`item.${item.id}.card`}>
          <View
            style={{
              backgroundColor: item.bgColor,
              height: cardHeight,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: insets.top,
              borderBottomLeftRadius: 18,
              borderBottomRightRadius: 18,
              // shadowOffset: {
              //   height: 2,
              //   width: 0,
              // },
              // shadowOpacity: 0.2,
              // shadowRadius: 4,
              // shadowColor: "#000000",
            }}
          ></View>
        </SharedElement>
        <SharedElement
          id={`item.${item.id}.photo`}
          style={{
            height: 250,
            width: 250,
            position: "absolute",
            top: cardHeight / 2 - 250 / 2 + insets.top / 2,
            alignSelf: "center",
          }}
        >
          <Image
            source={item.image}
            style={{ height: 250, width: 250, alignSelf: "center" }}
          />
        </SharedElement>
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
            {item.ingredients.map((_, i) => {
              return (
                <Animated.View
                  entering={FadeInDown.delay(150 + i * 150)}
                  style={{
                    flexDirection: "row",
                    // justifyContent: "center",
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
                  <Text style={{ marginLeft: 15 }}>{_}</Text>
                </Animated.View>
              );
            })}
          </View>
          <Heading mt="4" size="md">
            STEPS
          </Heading>

          <View style={{ marginTop: 15, paddingLeft: 10 }}>
            {item.instructions.map((_, i) => {
              return (
                <Animated.View
                  entering={FadeInDown.delay(150 + i * 150)}
                  style={{
                    // justifyContent: "center",
                    // alignItems: "center",
                    marginBottom: 25,
                    paddingRight: 15,
                    flex: 1,
                    borderWidth: 2,
                    borderRadius: 25,
                    paddingBottom: 15,
                    // height: 50,
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
                    {_}
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
