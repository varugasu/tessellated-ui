import { useEffect, useRef } from "react";
import { useWindowSize } from "usehooks-ts";

type Point = [number, number];

function drawTriangle(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  color: string
) {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  ctx.lineTo(...points[1]);
  ctx.lineTo(...points[2]);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.strokeStyle = "black";
  ctx.lineWidth = 0.5;
  ctx.stroke();
  ctx.fill();
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = useWindowSize();
  const triangleSize = Math.max(height / 8, 100);
  const h = (triangleSize * Math.sqrt(3)) / 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;

    const triangles: Point[][] = [];

    for (let y = -h / 2; y < height + h; y += h) {
      for (let x = -triangleSize; x < width + triangleSize; x += triangleSize) {
        const isUp = Math.floor(y / h) % 2 === 0;

        if (isUp) {
          triangles.push([
            [x + triangleSize / 2, y],
            [x + triangleSize, y + h],
            [x, y + h],
          ]);
          triangles.push([
            [x + triangleSize, y + h],
            [x + triangleSize * 1.5, y],
            [x + triangleSize / 2, y],
          ]);
        } else {
          triangles.push([
            [x + triangleSize / 2, y + h],
            [x, y],
            [x + triangleSize, y],
          ]);
          triangles.push([
            [x + triangleSize, y],
            [x + triangleSize * 1.5, y + h],
            [x + triangleSize / 2, y + h],
          ]);
        }
      }
    }

    // Animation loop
    const start = performance.now();
    let rafId: number;

    const animate = (now: number) => {
      const t = (now - start) / 1000;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < triangles.length; i++) {
        const points = triangles[i];

        const seed = (i * 0.61803398875) % 1;
        const phase = seed * Math.PI * 3;
        const freq = 0.5 + seed * 1;
        const wave = Math.sin(t * freq + phase);
        const hue = 220 + Math.sin(phase * 3) * 15;
        const lightness = 50 + wave * 5;
        const alpha = Math.max(0, wave) * 0.25;

        const color = `hsla(${hue}, 50%, ${lightness}%, ${alpha.toFixed(3)})`;
        drawTriangle(ctx, points, color);
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [height, width, triangleSize, h]);

  return (
    <div className="w-full h-screen bg-blue-500">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 z-10 pointer-events-none"
      />
      <div className="flex items-center justify-center text-[18rem] xl:text-[24rem] text-white tracking-[0.75rem] font-bold h-full">
        海
      </div>
    </div>
  );
}
