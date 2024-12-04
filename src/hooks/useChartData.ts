import { useCallback, useEffect, useRef, useState } from "react";
import { kmeans } from "../utils/k-means";

export const useChartData = ({
  k,
  maxIterations,
}: {
  k: string | number;
  maxIterations: string | number;
}) => {
  const chartRef = useRef(null);

  const [chartDataIte, setChartDataIte] = useState<any[]>([]);

  const [chartData, setChartData] = useState([
    {
      color: "blue.5",
      name: "Group 1",
      data: [
        { X: 1, Y: 1 },
        { X: 2, Y: 1 },
        { X: 1, Y: 3 },
        { X: 3, Y: 3 },
        { X: 4, Y: 3 },
        { X: 5, Y: 3 },
        { X: 1, Y: 2 },
        { X: 4, Y: 2 },
      ],
    },
  ]);

  const [disabled, setDisabled] = useState(false);

  const xDomain = 11;
  const yDomain = 12;

  // Generate arrays of integers for ticks
  const xTicks = Array.from({ length: xDomain }, (_, i) => i);
  const yTicks = Array.from({ length: yDomain }, (_, i) => i);

  useEffect(() => {
    normalizeData();
    disabled && setDisabled(!disabled);
  }, [k, maxIterations]);

  const normalizeData = useCallback(() => {
    setChartData((prevData) => [
      {
        color: "yellow.5",
        data: prevData.map((cluster) => cluster.data).flat(),
        name: "new",
      },
    ]);
  }, [chartData]);

  const handleReset = useCallback(() => {
    setChartData([
      {
        color: "blue.5",
        name: "Inital State",
        data: [
          { X: 1, Y: 1 },
          { X: 2, Y: 1 },
          { X: 1, Y: 3 },
          { X: 3, Y: 3 },
          { X: 4, Y: 3 },
          { X: 5, Y: 3 },
          { X: 1, Y: 2 },
          { X: 4, Y: 2 },
        ],
      },
    ]);
    setDisabled(false);
  }, [chartData]);

  const handleInvokeKMeans = () => {
    console.log(maxIterations);

    setChartData((prevData) => [
      {
        color: "yellow.5",
        data: prevData.map((cluster) => cluster.data).flat(),
        name: "new",
      },
    ]);

    const { ite } = kmeans({
      data: chartData[0].data,
      k: Number(k),
      maxIterations: Number(maxIterations),
    });

    setChartData(ite.reverse()[0].chartData);

    setChartDataIte(ite.reverse());

    setDisabled(true);
  };

  const handleChartClick = (event: any) => {
    normalizeData();

    if (!event || !event.nativeEvent || !chartRef.current) return;

    // @ts-ignore
    const rect = chartRef.current.getBoundingClientRect();

    const xClick = event.clientX - rect.left;
    const yClick = event.clientY - rect.top;

    const chartWidth = rect.width - 60;
    const chartHeight = rect.height - 60;

    const xData = Math.round(((xClick - 50) * 10) / chartWidth);
    const yData = Math.round(((rect.height - yClick - 50) * 11) / chartHeight);

    if (xData >= 0 && xData <= 80 && yData >= 0 && yData <= 32) {
      setChartData((prevData) => [
        {
          ...prevData[0],
          data: [...prevData[0].data, { X: xData, Y: yData }],
        },
      ]);

      setDisabled(false);
    }
  };

  return {
    handleInvokeKMeans,
    handleReset,
    chartData,
    disabled,
    handleChartClick,
    chartRef,
    chartDataIte,
    xTicks,
    yTicks,
    xDomain,
    yDomain,
  };
};
