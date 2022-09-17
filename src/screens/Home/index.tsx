import React, { PropsWithChildren, useRef } from "react";
import { FlatList, Image, Text, View } from "react-native";
import Animated from "react-native-reanimated";
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
  const y = useLazyRef(() => new Animated.Value(0));
  const onScroll = useLazyRef(() =>
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: { y },
          },
        },
      ],
      { useNativeDriver: true }
    )
  );
  return (
    <AnimatedFlatList
      scrollEventThrottle={16}
      bounces={false}
      {...{ onScroll }}
      data={RECIPES}
      renderItem={({ index, item }) => <RecipeCard {...{ index, y, item }} />}
      keyExtractor={(item) => `${item.id}`}
      contentContainerStyle={{
        paddingTop: 15,
      }}
    />
  );
};

const RecipeCard = ({ index, y, item }) => {
  console.log("ITEM", item);
  const imageSize = 180;
  return (
    <View
      style={{
        height: 220,
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
        marginBottom: 30,
        alignSelf: "center",
      }}
    >
      <View style={{ flexDirection: "row", flex: 1 }}>
        <View style={{ flex: 1, padding: 15, justifyContent: "flex-end" }}>
          <Text
            style={{
              fontSize: 20,
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
    </View>
  );
};

export { Home };
