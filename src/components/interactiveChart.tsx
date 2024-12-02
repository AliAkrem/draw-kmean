import { useState, useRef, useEffect, useCallback } from 'react';
import { ScatterChart } from '@mantine/charts';
import { Button, Group } from '@mantine/core';
import { kmeans } from '../utils/k-means';


type Props = {
    k: string | number
    maxIterations: string | number,

}

const InteractiveScatterChart = ({ k, maxIterations }: Props) => {

    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        normalizeData()
        disabled && setDisabled(!disabled)
    }, [k])


    const chartRef = useRef(null);
    const [chartData, setChartData] = useState([
        {
            color: 'blue.5',
            name: 'Group 1',
            data: [
                { X: 25, Y: 20 },
                { X: 30, Y: 22 },
                { X: 35, Y: 18 },
                { X: 40, Y: 25 },
                { X: 45, Y: 30 },
                { X: 28, Y: 15 },
                { X: 22, Y: 12 },
                { X: 50, Y: 28 }
            ]
        }
    ]);

    const handleChartClick = (event: any) => {

        normalizeData()

        if (!event || !event.nativeEvent || !chartRef.current) return;


        // @ts-ignore
        const rect = chartRef.current.getBoundingClientRect();

        const xClick = event.clientX - rect.left;
        const yClick = event.clientY - rect.top;

        const chartWidth = rect.width - 60;
        const chartHeight = rect.height - 60;

        const xData = Math.round((xClick - 50) * 80 / chartWidth);
        const yData = Math.round((rect.height - yClick - 50) * 32 / chartHeight);

        if (xData >= 0 && xData <= 80 && yData >= 0 && yData <= 32) {
            setChartData(prevData => [{
                ...prevData[0],
                data: [...prevData[0].data, { X: xData, Y: yData }]
            }]);

            setDisabled(false)

        }
    };


    const normalizeData = useCallback(() => {
        setChartData(prevData => [{
            color: 'yellow.5',
            data: prevData.map(cluster => cluster.data).flat(),
            name: "new",
        }]);
    }, [chartData])


    const handleReset = useCallback(() => {
        setChartData([{
            color: 'blue.5',
            name: 'Inital State',
            data: [
                { X: 25, Y: 20 },
                { X: 30, Y: 22 },
                { X: 35, Y: 18 },
                { X: 40, Y: 25 },
                { X: 45, Y: 30 },
                { X: 28, Y: 15 },
                { X: 22, Y: 12 },
                { X: 50, Y: 28 }
            ]
        }]);
        setDisabled(false)

    }, [chartData]);


    const handleInvokeKMeans = () => {

        setChartData(prevData => [{
            color: 'yellow.5',
            data: prevData.map(cluster => cluster.data).flat(),
            name: "new",
        }]);

        setChartData(kmeans({ data: chartData[0].data, k: Number(k), maxIterations: Number(maxIterations) }).chartData)
        setDisabled(true)
    }


    // Generate arrays of integers for ticks
    const xTicks = Array.from({ length: 81 }, (_, i) => i);
    const yTicks = Array.from({ length: 33 }, (_, i) => i);

    return (
        <div >
            <div
                ref={chartRef}
                className="cursor-crosshair"
                onClick={handleChartClick}
            >
                <ScatterChart
                    withLegend
                    h={350}
                    data={chartData}

                    dataKey={{ x: 'X', y: 'Y' }}
                    tickLine="none"
                    xAxisProps={{
                        domain: [0, 80],
                        ticks: xTicks,
                        tickLine: false
                    }}
                    yAxisProps={{
                        domain: [0, 32],
                        ticks: yTicks,
                        tickLine: false
                    }}
                />
            </div>
            <Group justify="center" mt="md">
                <Button onClick={handleReset} variant="light">
                    Reset Points
                </Button>

                <Button disabled={disabled} onClick={handleInvokeKMeans} variant="light">
                    invoke K-means
                </Button>
            </Group>
        </div>
    );
};

export default InteractiveScatterChart;