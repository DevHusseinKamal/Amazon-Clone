import { useLayoutEffect, useState } from "react";

export const useScreen = () => {
  const [screen, setScreen] = useState(2000);

  useLayoutEffect(() => {
    const updateScreen = () => {
      setScreen(window.innerWidth);
    };
    window.addEventListener("resize", updateScreen);

    return () => window.removeEventListener("resize", updateScreen);
  }, [screen]);

  return { screen };
};
