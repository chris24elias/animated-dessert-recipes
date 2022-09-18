import React, { PropsWithChildren } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../screens/Home";

import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { DetailScreen } from "../screens/Detail";
import { TransitionSpecs } from "@react-navigation/stack";

const Stack = createSharedElementStackNavigator();

const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const Navigation = ({}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            cardStyleInterpolator: forFade,
          }}
          sharedElements={(route, otherRoute, showing) => {
            const { item } = route.params;
            return [
              `item.${item.id}.card`,
              `item.${item.id}.photo`,
              {
                id: `item.${item.id}.text`,
                // resize: "none",
                resize: "clip",
                animation: "fade",
                // animation: "fade",
              },
            ];
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export { Navigation };
