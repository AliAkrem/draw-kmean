import { ScatterChart, ScatterChartSeries } from '@mantine/charts'



type Props = {
    data: ScatterChartSeries[] | []
}


export default function RepresentChart({ data }: Props) {




    const xTicks = Array.from({ length: 10 }, (_, i) => i);
    const yTicks = Array.from({ length: 11 }, (_, i) => i);

    return (
        <div>
            <div
            >
                <ScatterChart
                    withLegend
                    h={350}
                    data={data}

                    dataKey={{ x: 'X', y: 'Y' }}
                    tickLine="none"
                    xAxisProps={{
                        domain: [0, 10],
                        ticks: xTicks,
                        tickLine: false
                    }}
                    yAxisProps={{
                        domain: [0, 11],
                        ticks: yTicks,
                        tickLine: false
                    }}

                />
            </div>
        </div>
    )
}
