// "use client";

// import {
//   motion,
//   useSpring,
//   useTransform,
//   type MotionValue,
// } from "framer-motion";
// import type React from "react";
// import { useEffect } from "react";

// type PlaceValue = number | ".";

// interface NumberProps {
//   mv: MotionValue<number>;
//   number: number;
//   height: number;
// }

// function Number({ mv, number, height }: NumberProps) {
//   const y = useTransform(mv, (latest) => {
//     const placeValue = latest % 10;
//     const offset = (10 + number - placeValue) % 10;
//     let memo = offset * height;
//     if (offset > 5) {
//       memo -= 10 * height;
//     }
//     return memo;
//   });

//   const baseStyle: React.CSSProperties = {
//     position: "absolute",
//     inset: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   };

//   return <motion.span style={{ ...baseStyle, y }}>{number}</motion.span>;
// }

// function normalizeNearInteger(num: number): number {
//   const nearest = Math.round(num);
//   const tolerance = 1e-9 * Math.max(1, Math.abs(num));
//   return Math.abs(num - nearest) < tolerance ? nearest : num;
// }

// function getValueRoundedToPlace(value: number, place: number): number {
//   const scaled = value / place;
//   return Math.floor(normalizeNearInteger(scaled));
// }

// interface DigitProps {
//   place: PlaceValue;
//   value: number;
//   height: number;
//   digitStyle?: React.CSSProperties;
// }

// function Digit({ place, value, height, digitStyle }: DigitProps) {
//   // 🌟 ပြင်ဆင်ချက်: Hooks များကို အပေါ်ဆုံးတွင် အရင် (Unconditionally) ခေါ်ပါမည်
//   const isDecimal = place === ".";
//   // ဒသမ (Decimal) ဆိုရင် 0 ဟု သတ်မှတ်ထားပြီး Error မတက်အောင် ကာကွယ်ပါမည်
//   const valueRoundedToPlace = isDecimal
//     ? 0
//     : getValueRoundedToPlace(value, place as number);

//   const animatedValue = useSpring(valueRoundedToPlace, {
//     stiffness: 200,
//     damping: 25,
//   });

//   useEffect(() => {
//     if (!isDecimal) {
//       animatedValue.set(valueRoundedToPlace);
//     }
//   }, [animatedValue, valueRoundedToPlace, isDecimal]);

//   // 🌟 Hooks များခေါ်ပြီးမှသာ လိုအပ်လျှင် Early Return ပြန်လုပ်ပါမည်
//   if (isDecimal) {
//     return (
//       <span
//         className="relative inline-flex items-center justify-center"
//         style={{ height, width: "fit-content", ...digitStyle }}>
//         .
//       </span>
//     );
//   }

//   const defaultStyle: React.CSSProperties = {
//     height,
//     position: "relative",
//     width: "1ch",
//     fontVariantNumeric: "tabular-nums",
//   };

//   return (
//     <span
//       className="relative inline-flex overflow-hidden"
//       style={{ ...defaultStyle, ...digitStyle }}>
//       {Array.from({ length: 10 }, (_, i) => (
//         <Number key={i} mv={animatedValue} number={i} height={height} />
//       ))}
//     </span>
//   );
// }

// interface CounterProps {
//   value: number;
//   fontSize?: number;
//   padding?: number;
//   places?: PlaceValue[];
//   gap?: number;
//   borderRadius?: number;
//   horizontalPadding?: number;
//   textColor?: string;
//   fontWeight?: React.CSSProperties["fontWeight"];
// }

// export default function AnimatedCounter({
//   value,
//   fontSize = 40,
//   padding = 0,
//   places = [...value.toString()].map((ch, i, a) => {
//     if (ch === ".") return ".";
//     const dotIndex = a.indexOf(".");
//     const isInteger = dotIndex === -1;
//     const exponent = isInteger
//       ? a.length - i - 1
//       : i < dotIndex
//         ? dotIndex - i - 1
//         : -(i - dotIndex);
//     return 10 ** exponent;
//   }),
//   gap = 2,
//   borderRadius = 4,
//   horizontalPadding = 0,
//   textColor = "inherit",
//   fontWeight = "inherit",
// }: CounterProps) {
//   const height = fontSize + padding;

//   const defaultContainerStyle: React.CSSProperties = {
//     position: "relative",
//     display: "inline-block",
//   };
//   const defaultCounterStyle: React.CSSProperties = {
//     fontSize,
//     display: "flex",
//     gap,
//     overflow: "hidden",
//     borderRadius,
//     paddingLeft: horizontalPadding,
//     paddingRight: horizontalPadding,
//     lineHeight: 1,
//     color: textColor,
//     fontWeight,
//     direction: "ltr",
//   };

//   return (
//     <span style={defaultContainerStyle}>
//       <span style={defaultCounterStyle}>
//         {places.map((place, i) => (
//           <Digit
//             key={`${place}-${i}`}
//             place={place}
//             value={value}
//             height={height}
//           />
//         ))}
//       </span>
//     </span>
//   );
// }

"use client";

import {
  motion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type React from "react";
import { useEffect } from "react";

type PlaceValue = number | "." | ",";

interface NumberProps {
  mv: MotionValue<number>;
  number: number;
  height: number;
}

function Number({ mv, number, height }: NumberProps) {
  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;

    let memo = offset * height;

    if (offset > 5) {
      memo -= 10 * height;
    }

    return memo;
  });

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return <motion.span style={{ ...baseStyle, y }}>{number}</motion.span>;
}

function normalizeNearInteger(num: number): number {
  const nearest = Math.round(num);
  const tolerance = 1e-9 * Math.max(1, Math.abs(num));

  return Math.abs(num - nearest) < tolerance ? nearest : num;
}

function getValueRoundedToPlace(value: number, place: number): number {
  const scaled = value / place;

  return Math.floor(normalizeNearInteger(scaled));
}

interface DigitProps {
  place: PlaceValue;
  value: number;
  height: number;
  digitStyle?: React.CSSProperties;
}

function Digit({ place, value, height, digitStyle }: DigitProps) {
  const isDecimal = place === ".";
  const isComma = place === ",";

  const valueRoundedToPlace =
    isDecimal || isComma ? 0 : getValueRoundedToPlace(value, place as number);

  const animatedValue = useSpring(valueRoundedToPlace, {
    stiffness: 200,
    damping: 25,
  });

  useEffect(() => {
    if (!isDecimal && !isComma) {
      animatedValue.set(valueRoundedToPlace);
    }
  }, [animatedValue, valueRoundedToPlace, isDecimal, isComma]);

  if (isDecimal || isComma) {
    return (
      <span
        className="relative inline-flex items-center justify-center"
        style={{
          height,
          width: "fit-content",
          ...digitStyle,
        }}>
        {place}
      </span>
    );
  }

  const defaultStyle: React.CSSProperties = {
    height,
    position: "relative",
    width: "1ch",
    fontVariantNumeric: "tabular-nums",
  };

  return (
    <span
      className="relative inline-flex overflow-hidden"
      style={{ ...defaultStyle, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </span>
  );
}

interface CounterProps {
  value: number;
  fontSize?: number;
  padding?: number;
  places?: PlaceValue[];
  gap?: number;
  borderRadius?: number;
  horizontalPadding?: number;
  textColor?: string;
  fontWeight?: React.CSSProperties["fontWeight"];
}

export default function AnimatedCounter({
  value,
  fontSize = 40,
  padding = 0,
  places = [...Intl.NumberFormat("en-US").format(value)].map((ch, i, arr) => {
    if (ch === ".") return ".";
    if (ch === ",") return ",";

    const cleanArr = arr.filter((c) => c !== ",");

    const cleanIndex = cleanArr.findIndex((_, idx) => {
      let originalIndex = -1;
      let count = -1;

      for (let j = 0; j < arr.length; j++) {
        if (arr[j] !== ",") {
          count++;
        }

        if (count === idx) {
          originalIndex = j;
          break;
        }
      }

      return originalIndex === i;
    });

    const dotIndex = cleanArr.indexOf(".");
    const isInteger = dotIndex === -1;

    const exponent = isInteger
      ? cleanArr.length - cleanIndex - 1
      : cleanIndex < dotIndex
        ? dotIndex - cleanIndex - 1
        : -(cleanIndex - dotIndex);

    return 10 ** exponent;
  }),
  gap = 2,
  borderRadius = 4,
  horizontalPadding = 0,
  textColor = "inherit",
  fontWeight = "inherit",
}: CounterProps) {
  const height = fontSize + padding;

  const defaultContainerStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-block",
  };

  const defaultCounterStyle: React.CSSProperties = {
    fontSize,
    display: "flex",
    gap,
    overflow: "hidden",
    borderRadius,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    lineHeight: 1,
    color: textColor,
    fontWeight,
    direction: "ltr",
  };

  return (
    <span style={defaultContainerStyle}>
      <span style={defaultCounterStyle}>
        {places.map((place, i) => (
          <Digit
            key={`${place}-${i}`}
            place={place}
            value={value}
            height={height}
          />
        ))}
      </span>
    </span>
  );
}