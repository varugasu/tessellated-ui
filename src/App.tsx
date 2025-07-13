import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowSize } from "usehooks-ts";

type Points = [number, number];

type Triangle = {
  points: Points[];
  debugColor?: string;
};

function App() {
  const { width, height } = useWindowSize();
  const triangleSize = Math.max(height / 8, 100);
  const h = triangleSize * (Math.sqrt(3) / 2);

  const triangles = useMemo(() => {
    const triangles: Triangle[] = [];
    for (let y = -h / 2; y < height + h; y += h) {
      for (let x = -triangleSize; x < width + triangleSize; x += triangleSize) {
        const isUp = Math.floor(y / h) % 2 === 0;

        if (isUp) {
          triangles.push({
            points: [
              [x + triangleSize / 2, y],
              [x + triangleSize, y + h],
              [x, y + h],
            ],
            debugColor: "red",
          });
          triangles.push({
            points: [
              [x + triangleSize, y + h],
              [x + triangleSize * 1.5, y],
              [x + triangleSize / 2, y],
            ],
            debugColor: "green",
          });
        } else {
          triangles.push({
            points: [
              [x + triangleSize / 2, y + h],
              [x, y],
              [x + triangleSize, y],
            ],
            debugColor: "blue",
          });
          triangles.push({
            points: [
              [x + triangleSize, y],
              [x + triangleSize * 1.5, y + h],
              [x + triangleSize / 2, y + h],
            ],
            debugColor: "purple",
          });
        }
      }
    }
    return triangles;
  }, [height, width, triangleSize, h]);

  const [time, setTime] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const t = (now - start) / 1000; // seconds
      setTime(t);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current!);
  }, []);

  function getTriangleColor(index: number, t: number): string {
    const seed = (index * 0.61803398875) % 1;
    const phase = seed * Math.PI * 3;
    const freq = 0.5 + seed * 1;
    const wave = Math.sin(t * freq + phase);
    const hue = 220 + Math.sin(phase * 3) * 15;
    const lightness = 50 + wave * 5;
    const alpha = Math.max(0, wave) * 0.25;

    return `hsla(${hue}, 50%, ${lightness}%, ${alpha.toFixed(3)})`;
  }

  return (
    <div
      className="w-full bg-blue-500"
      style={{ height: `${height}px`, position: "relative" }}
    >
      <svg width={width} height={height} className="absolute select-none">
        {triangles.map((triangle, index) => (
          <polygon
            key={index}
            points={triangle.points.map((point) => point.join(",")).join(" ")}
            stroke="black"
            strokeWidth={0.15}
            fill={getTriangleColor(index, time)}
          />
        ))}
      </svg>
      <div className="text-[18rem] xl:text-[24rem]  text-white tracking-[0.75rem] font-bold h-full flex items-center justify-center">
        海
      </div>
    </div>
  );
}

export default App;
