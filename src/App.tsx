import { useEffect, useRef, useState } from "react";

type Points = [number, number];

type Triangle = {
  points: Points[];
  color: string;
};

function App() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const triangleSize = 100;
  const h = (triangleSize * Math.sqrt(3)) / 2;
  const triangles: Triangle[] = [];

  for (let y = 0; y < height + h; y += h) {
    for (let x = -triangleSize; x < width + triangleSize; x += triangleSize) {
      const isUp = Math.floor(y / h) % 2 === 0;

      if (isUp) {
        triangles.push({
          points: [
            [x + triangleSize / 2, y],
            [x + triangleSize, y + h],
            [x, y + h],
          ],
          color: "red",
        });
        triangles.push({
          points: [
            [x + triangleSize, y + h],
            [x + triangleSize * 1.5, y],
            [x + triangleSize / 2, y],
          ],
          color: "green",
        });
      } else {
        triangles.push({
          points: [
            [x + triangleSize / 2, y + h],
            [x, y],
            [x + triangleSize, y],
          ],
          color: "blue",
        });
        triangles.push({
          points: [
            [x + triangleSize, y],
            [x + triangleSize * 1.5, y + h],
            [x + triangleSize / 2, y + h],
          ],
          color: "purple",
        });
      }
    }
  }

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
    <div className="w-full bg-blue-500 h-screen">
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
      <div className="text-[45rem] text-white tracking-[0.75rem] font-bold text-center">
        海
      </div>
    </div>
  );
}

export default App;
