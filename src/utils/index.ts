export const AppColors = {
  primary: "#7AC5C1",
  primaryLighter: "#E6F9FF",
  white: "#ffffff",
  realBlack: "#000000",
  text: "#0F1E31",
  black: "#0F1E31",
  blackLight: "#1B2C41",
  orangeDark: "#CE5A01",
  yellow: "#FFEF7D",
  sugar: "#FBF5E9",
  honey: "#DA7C16",
  pinkLight: "#F9B7B6",
  green: "#ADBE56",
  red: "#CF252F",
};

export const images = {
  "1": require("../../assets/images/desserts/01-lemon-cheesecake.png"),
  "1-bg": require("../../assets/images/desserts/01-lemon-cheesecake-bg.png"),
  "2": require("../../assets/images/desserts/02-chocolate-cake-1.png"),
  "3": require("../../assets/images/desserts/03-chocolate-donuts.png"),
  "4": require("../../assets/images/desserts/04-fluffy-cake.png"),
  "5": require("../../assets/images/desserts/05-macaroons.png"),
  "6": require("../../assets/images/desserts/06-white-cream-cake.png"),
  "7": require("../../assets/images/desserts/07-honey-cake.png"),
  "8": require("../../assets/images/desserts/08-cream-cupcakes.png"),
  "9": require("../../assets/images/desserts/09-fruit-plate.png"),
  "10": require("../../assets/images/desserts/10-strawberries.png"),
  "11": require("../../assets/images/desserts/11-powdered-cake.png"),
  "12": require("../../assets/images/desserts/12-chocolate-cake-2.png"),
  "13": require("../../assets/images/desserts/13-strawberry-powdered-cake.png"),
  "14": require("../../assets/images/desserts/14-fruit-pie.png"),
  "15": require("../../assets/images/desserts/15-apple-pie.png"),
};

// from redash
// export const transformOrigin = (
//   { x, y }: Vector,
//   transformations: RNTransform
// ): RNTransform => {
//   "worklet";
//   return ([{ translateX: x }, { translateY: y }] as RNTransform)
//     .concat(transformations)
//     .concat([{ translateX: -x }, { translateY: -y }]);
// };

export const getTranslateZ = (perspective: number, z: number) => {
  "worklet";
  return perspective / (perspective - z);
};

export function getContrast(hexcolor: string) {
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
}

export const diffClamp = (val: number, min: number, max: number) => {
  "worklet";

  if (val >= max) {
    return max;
  }
  if (val <= min) {
    return min;
  }
  return val;
};

export const degreeToRad = (degree: number) => {
  "worklet";

  return degree * (Math.PI / 180);
};
