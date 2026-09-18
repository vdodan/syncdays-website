import { Composition } from "remotion";
import { HeroCalendar } from "./HeroCalendar";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="HeroCalendar"
        component={HeroCalendar}
        durationInFrames={180} // 6 seconds at 30fps - loops smoothly
        fps={30}
        width={1280}
        height={720}
        defaultProps={{}}
      />
    </>
  );
};
