import { Composition } from "remotion";
import { LogoAnimation } from "./LogoAnimation";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="LogoAnimation"
      component={LogoAnimation}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
