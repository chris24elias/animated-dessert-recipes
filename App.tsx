import "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Navigation } from "./src/Navigation";
import { NativeBaseProvider } from "native-base";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeBaseProvider>
        <Navigation />
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
}
