import { Composition } from "remotion";
import { Timer30Min } from "./Timer30Min";
import { LogoAnimation } from "./LogoAnimation";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Full 30-Minute Countdown (54,000 frames @ 30fps) */}
      <Composition
        id="Timer30Min"
        component={Timer30Min}
        durationInFrames={30 * 60 * 30}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          durationInMinutes: 30,
        }}
      />

      {/* 1-Minute Preview Composition for fast Remotion Studio testing */}
      <Composition
        id="Timer1MinPreview"
        component={Timer30Min}
        durationInFrames={60 * 30}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          durationInMinutes: 1,
        }}
      />

      {/* Legacy Logo Animation */}
      <Composition
        id="LogoAnimation"
        component={LogoAnimation}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
