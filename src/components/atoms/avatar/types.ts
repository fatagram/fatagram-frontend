export const sizeClasses = {
  // Mini sizes
  "xs-1": "w-[24px]",
  "xs-2": "w-[32px]",
  "xs-3": "w-[40px]",

  // Small sizes
  "sm-1": "w-[48px]",
  "sm-2": "w-[56px]",
  "sm-3": "w-[64px]",

  // Medium sizes
  "md-1": "w-[96px]",
  "md-2": "w-[112px] ",
  "md-3": "w-[128px]",

  // Large sizes
  "lg-1": "w-[160px]",
  "lg-2": "w-[192px]",
  "lg-3": "w-[224px]",

  // Extra Large
  "xl-1": "w-[256px]",
  "xl-2": "w-[288px]",
  "xl-3": "w-[320px]",
} as const;

export const shapeClasses = {
  square: "rounded-none",
  rounded: "rounded-2xl",
  circle: "rounded-full",
} as const;
