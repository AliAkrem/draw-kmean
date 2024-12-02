import { createUniqueMantineColorGenerator } from "./genColor";

class Point {
  constructor(
    public x: number,
    public y: number
  ) {}
}

/**
 * Calculates the Euclidean distance between two points in a 2D space.
 *
 * @param p1 - The first point.
 * @param p2 - The second point.
 * @returns The Euclidean distance between the two points.
 */
function euclideanDistance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

/**
 *
 * @param points
 * @param centroids
 * @param pointIndex
 * @returns closest centroids index
 *
 */

function findClosestCentroid(
  points: Point[],
  centroids: Point[],
  pointIndex: number
): number {
  let minDistance = Infinity;
  let closestCentroidIndex = -1;

  for (let i = 0; i < centroids.length; i++) {
    const distance = euclideanDistance(points[pointIndex], centroids[i]);
    if (distance < minDistance) {
      minDistance = distance;
      closestCentroidIndex = i;
    }
  }

  return closestCentroidIndex;
}

function calculateNewCentroids(
  points: Point[],
  assignments: number[],
  k: number
): Point[] {
  const newCentroids: Point[] = Array(k)
    .fill(null)
    .map(() => new Point(0, 0));

  const counts: number[] = Array(k).fill(0);

  for (let i = 0; i < points.length; i++) {
    const centroidIndex = assignments[i];
    newCentroids[centroidIndex].x += points[i].x;
    newCentroids[centroidIndex].y += points[i].y;
    counts[centroidIndex]++;
  }

  for (let i = 0; i < k; i++) {
    if (counts[i] > 0) {
      newCentroids[i].x /= counts[i];
      newCentroids[i].y /= counts[i];
    }
  }

  return newCentroids;
}

// function main() {
//   // Example usage
//   const points: Point[] = [
//     new Point(1, 1),
//     new Point(1, 2),
//     new Point(2, 1),
//     new Point(1, 3),
//     new Point(3, 3),
//     new Point(4, 2),
//     new Point(4, 3),
//     new Point(5, 3),
//   ];

//   const k = 2;
//   const maxIterations = 100;

//   let centroids: Point[] = points.slice(0, k);

//   let assignments: number[] = Array(points.length).fill(0);

//   let didCenterChange = false;
//   let iteration = 0;

//   while (!didCenterChange && iteration < maxIterations) {
//     // Assign points to the closest centroid
//     for (let i = 0; i < points.length; i++) {
//       assignments[i] = findClosestCentroid(points, centroids, i);
//     }

//     // Calculate new centroids
//     const newCentroids = calculateNewCentroids(points, assignments, k);

//     // Check for convergence
//     didCenterChange = true;

//     for (let i = 0; i < k; i++) {
//       if (euclideanDistance(centroids[i], newCentroids[i]) > 1e-6) {
//         didCenterChange = false;
//         break;
//       }
//     }

//     console.log(`+======= Iteration ${iteration}==========+`);

//     for (let i = 0; i < points.length; i++) {
//       console.log(
//         `Point (${points[i].x}, ${points[i].y}) assigned to cluster ${assignments[i]} center (${centroids[assignments[i]].x}, ${centroids[assignments[i]].y})`
//       );
//     }

//     console.log(`+========================================+`);

//     centroids = newCentroids;
//     iteration++;
//   }

//   // Print the cluster assignments

//   console.log("+=========== Final Assignment ==========+");
//   for (let i = 0; i < points.length; i++) {
//     console.log(
//       `Point (${points[i].x}, ${points[i].y}) assigned to cluster ${assignments[i]}`
//     );
//   }
// }

type KmeansProps = {
  data: {
    X: number;
    Y: number;
  }[];
  k: number;
  maxIterations: number;
};

type KmeansReturn = {
  chartData: {
    color: string;
    name: string;
    data: {
      X: number;
      Y: number;
    }[];
  }[];
};

const getUniqueColor = createUniqueMantineColorGenerator();

export function kmeans({ data, k, maxIterations }: KmeansProps): KmeansReturn {
  const points = data.map((point) => {
    return new Point(point.X, point.Y);
  });

  let centroids: Point[] = points.slice(0, k);

  let assignments: number[] = Array(points.length).fill(0);

  let didCenterChange = false;
  let iteration = 0;

  while (!didCenterChange && iteration < maxIterations) {
    // Assign points to the closest centroid
    for (let i = 0; i < points.length; i++) {
      assignments[i] = findClosestCentroid(points, centroids, i);
    }

    // Calculate new centroids
    const newCentroids = calculateNewCentroids(points, assignments, k);

    // Check for convergence
    didCenterChange = true;

    for (let i = 0; i < k; i++) {
      if (euclideanDistance(centroids[i], newCentroids[i]) > 1e-6) {
        didCenterChange = false;
        break;
      }
    }
    centroids = newCentroids;
    iteration++;
  }

  getUniqueColor.reset();

  const response: KmeansReturn = {
    chartData: Array(k)
      .fill(null)
      .map((_, clusterIndex) => {
        // Get all points belonging to this cluster
        const clusterPoints = points
          .filter((_, pointIndex) => assignments[pointIndex] === clusterIndex)
          .map((point) => ({ X: point.x, Y: point.y }));

        return {
          color: getUniqueColor.getRandomUniqueMantineColor(),
          name: `Cluster ${clusterIndex}`,
          data: clusterPoints,
        };
      }),
  };

  return {
    chartData: [
      ...response.chartData,
      ...centroids.map((center) => {
        return {
          color: "white",
          name: `center `,
          data: [{ X: center.x, Y: center.y }],
        };
      }),
    ],
  };
}
