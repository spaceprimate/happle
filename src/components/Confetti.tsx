import React, { useEffect, useRef } from "react";

const CONFETTI_COLORS = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF"];
const CONFETTI_COUNT = 80;

type ConfettiPiece = {
  x: number;
  y: number;
  r: number;
  color: string;
  speed: number;
  tilt: number;
  tiltSpeed: number;
};

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const Confetti: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    }
    window.addEventListener("resize", resize);

    // Generate confetti pieces
    const confetti: ConfettiPiece[] = Array.from({ length: CONFETTI_COUNT }, () => ({
      x: randomBetween(0, width),
      y: randomBetween(-height, 0),
      r: randomBetween(5, 10),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      speed: randomBetween(1, 2.5),
      tilt: randomBetween(-10, 10),
      tiltSpeed: randomBetween(0.05, 0.12),
    }));

    function drawConfettiPiece(piece: ConfettiPiece) {
      if (!ctx) return;
      ctx.save();
      ctx.beginPath();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.tilt * Math.PI / 180);
      ctx.fillStyle = piece.color;
      // Draw as a small rectangle
      ctx.fillRect(-piece.r / 2, -piece.r / 2, piece.r, piece.r * 0.6);
      ctx.restore();
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (const piece of confetti) {
        piece.y += piece.speed;
        piece.tilt += piece.tiltSpeed;

        // Respawn at top if out of view
        if (piece.y > height + 20) {
          piece.x = randomBetween(0, width);
          piece.y = randomBetween(-20, 0);
          piece.r = randomBetween(5, 10);
          piece.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
          piece.speed = randomBetween(1, 2.5);
          piece.tilt = randomBetween(-10, 10);
          piece.tiltSpeed = randomBetween(0.05, 0.12);
        }

        drawConfettiPiece(piece);
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        background: "transparent",
      }}
    />
  );
};

export default Confetti;