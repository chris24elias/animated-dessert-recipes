import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { Box, Icon, IconButton } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const FloatingBackButton: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const size = 40;

  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(500, withTiming(1));
  }, []);

  const style = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        style,
        {
          position: "absolute",
          top: insets.top,
          left: "2%",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 10000000000000,
          justifyContent: "center",
          alignItems: "center",
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <IconButton
        onPress={() => navigation.goBack()}
        icon={
          <Icon size="lg" as={<Feather name="chevron-left" />} color="white" />
        }
      />
    </Animated.View>
  );
};

export default FloatingBackButton;

const styles = StyleSheet.create({});
