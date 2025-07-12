type Points = [number, number];

type Triangle = {
  points: Points[];
  color: string;
};

function App() {
  const width = window.innerWidth;
  const height = 200;
  const triangleSize = 50;
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

  return (
    <div className="w-full">
      <svg width={width} height={height} className="bg-red-100">
        {triangles.map((triangle, index) => (
          <polygon
            key={index}
            points={triangle.points.map((point) => point.join(",")).join(" ")}
            stroke="black"
            // fill="none"
            fill={triangle.color}
          />
        ))}
      </svg>
    </div>
  );
}

export default App;
