import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800", "900"],
});

export interface Timer30MinProps {
  durationInMinutes?: number;
  logoSrc?: string;
  bgSrc?: string;
  ellipseSrc?: string;
  pillSrc?: string;
}

export const Timer30Min: React.FC<Timer30MinProps> = ({
  durationInMinutes = 30,
  logoSrc = staticFile("Vector.svg"),
  bgSrc = staticFile("fundo.png"),
  ellipseSrc = staticFile("Ellipse 18.png"),
  pillSrc = staticFile("Group 319.png"),
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Entrance animations
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const logoSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 14, stiffness: 80 },
  });
  const logoY = interpolate(logoSpring, [0, 1], [-40, 0]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

  const pillSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, stiffness: 90 },
  });
  const pillScale = interpolate(pillSpring, [0, 1], [0.8, 1]);
  const pillOpacity = interpolate(pillSpring, [0, 1], [0, 1]);

  const ellipseSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 16, stiffness: 70 },
  });
  const ellipseScale = interpolate(ellipseSpring, [0, 1], [0.6, 1]);
  const ellipseOpacity = interpolate(ellipseSpring, [0, 1], [0, 1]);

  // Continuous subtle rotation for dashed ellipse
  const ellipseRotation = (frame * 0.12) % 360;

  // Countdown timer logic
  const totalSeconds = durationInMinutes * 60;
  const currentSecond = Math.max(0, totalSeconds - Math.floor(frame / fps));

  const minutes = Math.floor(currentSecond / 60);
  const seconds = currentSecond % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  // Per-second subtle pulse effect
  const frameInSecond = frame % fps;
  const pulse = interpolate(
    frameInSecond,
    [0, 3, 12],
    [1.025, 0.995, 1],
    { extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#050505",
        fontFamily,
      }}
    >
      {/* Background Image (Positioned to place Tiago Tessmann perfectly framed on the right) */}
      <Img
        src={bgSrc}
        style={{
          position: "absolute",
          top: 0,
          left: -700,
          height: 1080,
          width: "auto",
          maxWidth: "none",
          opacity: bgOpacity,
        }}
      />

      {/* Dashed Ellipse in Bottom Left Corner */}
      <div
        style={{
          position: "absolute",
          left: -130,
          bottom: -130,
          width: 520,
          height: 520,
          transform: `scale(${ellipseScale}) rotate(${ellipseRotation}deg)`,
          opacity: ellipseOpacity,
          transformOrigin: "center center",
          pointerEvents: "none",
        }}
      >
        <Img
          src={ellipseSrc}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Ghost 30:00 watermark text in background */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 485,
          color: "rgba(255, 255, 255, 0.035)",
          fontSize: 104,
          fontWeight: 900,
          letterSpacing: "-0.02em",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 1,
        }}
      >
        30:00
      </div>

      {/* Main Content Area (Left side) */}
      <div
        style={{
          position: "absolute",
          left: 620,
          top: 500,
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        {/* Logo: "A MÁQUINA DE CLIENTES" */}
        <div
          style={{
            transform: `translateY(${logoY}px)`,
            opacity: logoOpacity,
            marginBottom: 24,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Img
            src={logoSrc}
            style={{
              width: 320,
              height: "auto",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Timer Pill Container */}
        <div
          style={{
            position: "relative",
            width: 530,
            height: 115,
            transform: `scale(${pillScale})`,
            opacity: pillOpacity,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Pill Background Image */}
          <Img
            src={pillSrc}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "fill",
            }}
          />

          {/* Countdown Text */}
          <div
            style={{
              position: "relative",
              zIndex: 3,
              color: "#0a0a0a",
              fontSize: 54,
              fontWeight: 800,
              letterSpacing: "-0.01em",
              fontVariantNumeric: "tabular-nums",
              fontFeatureSettings: '"tnum"',
              transform: `scale(${pulse})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ minWidth: "2.3em", textAlign: "right" }}>{formattedMinutes}</span>
            <span style={{ margin: "0 4px", position: "relative", top: -2 }}>:</span>
            <span style={{ minWidth: "2.3em", textAlign: "left" }}>{formattedSeconds}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
