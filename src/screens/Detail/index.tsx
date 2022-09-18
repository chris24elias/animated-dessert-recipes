import { Heading } from "native-base";
import React, { PropsWithChildren } from "react";
import { Image, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SharedElement } from "react-navigation-shared-element";
import FloatingBackButton from "../../components/FloatingBackButton";

export type IDetailScreenProps = {};

const DetailScreen = ({ route }: PropsWithChildren<IDetailScreenProps>) => {
  const { item } = route.params;
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const cardHeight = height * 0.5;

  return (
    <View style={{ flex: 1 }}>
      <FloatingBackButton />
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
              fontSize: 15,
              fontWeight: "600",
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: 12,
              marginTop: 10,
            }}
          >
            {item.description}
          </Text>
        </View>
      </SharedElement>
      <View style={{ padding: 10 }}>
        <Heading mt="4" size="sm">
          INGREDIENTS
        </Heading>
      </View>
    </View>
  );
};

export { DetailScreen };
