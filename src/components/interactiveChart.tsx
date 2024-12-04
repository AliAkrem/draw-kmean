import { ScatterChart } from '@mantine/charts';
import { Button, Group, ScrollArea, Tabs } from '@mantine/core';
import { useChartData } from '../hooks/useChartData';
import { Ite } from '../utils/k-means';
import RepresentChart from './representalChart';
import ClusterDataTable from './clusterDataTable';
import classes from '../App.module.css';


type Props = {
    k: string | number
    maxIterations: string | number,

}




const representTabs = (chartDataIte: Ite[]) => {

    if (chartDataIte.length == 0) return <></>


    return chartDataIte.map((_, idx) => {

        let index = idx+1;
        return (
            <Tabs.Tab value={`iteration-${+index}`  } >
                Iteration {index}
            </Tabs.Tab>
        )



    })
}


const represent = (chartDataIte: Ite[]) => {

    if (chartDataIte.length == 0) return <></>

    
    return chartDataIte.map((ite, idx) => {
        
        let index = idx+1;

        return (
            <Tabs.Panel value={`iteration-${+index}`}>
                <RepresentChart data={ite.chartData} />


                <ScrollArea scrollbarSize={2} classNames={classes} w={"100%"} >
                    <ClusterDataTable chartData={ite.chartData} />
                </ScrollArea>
            </Tabs.Panel>
        )



    })
}

const InteractiveScatterChart = ({ k, maxIterations }: Props) => {



    const { handleReset, handleInvokeKMeans, chartData, disabled, chartRef, handleChartClick, chartDataIte, xDomain, xTicks, yDomain, yTicks } = useChartData({ k, maxIterations })




    return (
        <div >
            <div
            >
                <ScatterChart
                    ref={chartRef}
                    onClick={handleChartClick}
                    withLegend
                    h={350}
                    data={chartData}

                    dataKey={{ x: 'X', y: 'Y' }}
                    tickLine="none"
                    xAxisProps={{
                        domain: [0, xDomain],
                        ticks: xTicks,
                        tickLine: false
                    }}
                    yAxisProps={{
                        domain: [0, yDomain],
                        ticks: yTicks,
                        tickLine: false
                    }}
                    legendProps={{ verticalAlign: 'top', height: 20 }}

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


            <div>
                <Tabs defaultValue="iteration-1"  >
                    <Tabs.List>
                        {representTabs(chartDataIte)}
                    </Tabs.List>

                    {represent(chartDataIte)}
                </Tabs>
            </div>

        </div>
    );
};

export default InteractiveScatterChart;