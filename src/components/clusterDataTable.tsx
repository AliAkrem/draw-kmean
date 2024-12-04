import { useMemo } from 'react';
import { Table,  Box, Paper } from '@mantine/core';
import { euclideanDistance, Point as Pt } from '../utils/k-means';

type Point = {
    X: number;
    Y: number;
};

type ChartDataItem = {
    color: string;
    name: string;
    data: Point[];
};

type Props = {
    chartData: ChartDataItem[];
};

const ClusterDataTable = ({ chartData }: Props) => {
    const { centers, clusters, allPoints } = useMemo(() => {
        // Separate centers and clusters
        const centers = chartData.filter(item => item.name.toLowerCase().includes('center'))
            .sort((a, b) => {
                const aIndex = parseInt(a.name.split(' ').pop() || '0');
                const bIndex = parseInt(b.name.split(' ').pop() || '0');
                return aIndex - bIndex;
            });

        const clusters = chartData.filter(item => item.name.toLowerCase().includes('cluster')).map(
            (cluster) => { return { ...cluster, data: cluster.data } }
        );

        // const clustersRow = chartData.filter(item => item.name.toLowerCase().includes('cluster')).map(
        //     (cluster) => { return { ...cluster, data: cluster.data } }
        // );


        const allPoints = chartData.filter(item => item.name.toLowerCase().includes('cluster')).map(data => data.data).flat()



        console.log({ allPoints })


        // Get all points from cluster data
        // const allPoints = clusters.reduce((acc, cluster) => {
        //     cluster.data.forEach((point, index) => {
        //         if (!acc[index]) acc[index] = [];
        //         acc[index].push(point);
        //     });
        //     return acc;
        // }, [] as Point[][]);

        return { centers, clusters, allPoints };
    }, [chartData]);

    // Generate column headers for points
    const pointColumns = Array.from({ length: allPoints.length }, (_, i) => `pt${i + 1}`);
    const centerColumns = centers.map((_, idx) => `Centre ${idx + 1}`);

    return (
        <Paper shadow="xs" p="md">
            <Box>
                {/* Upper table */}
                <Table withTableBorder withColumnBorders striped>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Classe</Table.Th>
                            <Table.Th>Axes</Table.Th>
                            {centerColumns.map((col) => (
                                <Table.Th key={col}>{col}</Table.Th>
                            ))}
                            {pointColumns.map((col) => (
                                <Table.Th key={col}>{col}</Table.Th>
                            ))}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td rowSpan={2}>Total/{clusters.length}</Table.Td>
                            <Table.Td>X</Table.Td>
                            {centers.map((center, idx) => (
                                <Table.Td key={`center-${idx}-x`}>
                                    {center.data[0]?.X.toFixed(0)}
                                </Table.Td>
                            ))}
                            {allPoints.map((points, idx) => (
                                <Table.Td key={`point-${idx}-x`}>
                                    {points?.X.toFixed(0)}
                                </Table.Td>
                            ))}
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>Y</Table.Td>
                            {centers.map((center, idx) => (
                                <Table.Td key={`center-${idx}-y`}>
                                    {center.data[0]?.Y.toFixed(0)}
                                </Table.Td>
                            ))}
                            {allPoints.map((points, idx) => (
                                <Table.Td key={`point-${idx}-y`}>
                                    {points?.Y.toFixed(0)}
                                </Table.Td>
                            ))}
                        </Table.Tr>

                        {
                            centers.map((center, idx) => (
                                <Table.Tr key={`distance-center${center.name}-point${idx}`} >

                                    {idx === 0 && <Table.Td rowSpan={centers.length} ></Table.Td>}
                                    <Table.Td colSpan={centers.length + 1}>
                                        distance (Center{idx + 1}, pt<sub>i</sub>)
                                    </Table.Td>


                                    {
                                        allPoints.map((point, ) => (


                                            <>
                                                <Table.Td >
                                                    {euclideanDistance(new Pt(point.X, point.Y), new Pt(center.data[0].X, center.data[0].Y)).toFixed(2)}
                                                </Table.Td>
                                            </>
                                        ))
                                    }


                                </Table.Tr>

                            )
                            )
                        }

                        {
                            centers.map((_, idxCenter) => (
                                <>
                                    <Table.Tr>
                                        {idxCenter === 0 && <Table.Td rowSpan={centers.length} ></Table.Td>}
                                        <Table.Td colSpan={centers.length + 1}>
                                            distance min
                                        </Table.Td>


                                        {
                                            allPoints.map((point) => {

                                                const distances = centers.map((center, idx) => {
                                                    return { dis: euclideanDistance(new Pt(point.X, point.Y), new Pt(center.data[0].X, center.data[0].Y)), idxCenter: idx }
                                                }
                                                );


                                                const minDistance = distances.reduce((min, current) => {

                                                    const minDistance = Math.min(Number(min.dis), Number(current.dis))

                                                    return { dis: minDistance, idxCenter: distances.filter(idx => idx.dis === minDistance)[0].idxCenter }


                                                })

                                                return (<>
                                                    {minDistance.idxCenter == idxCenter ? <Table.Td  >
                                                        {minDistance.dis.toFixed(2)}
                                                    </Table.Td > : <Table.Td  >

                                                    </Table.Td >}
                                                </>)
                                            })
                                        }


                                    </Table.Tr >
                                </>

                            )
                            )
                        }
                    </Table.Tbody>
                </Table>

                {/* Lower table */}
                <Table mt="lg" withTableBorder withColumnBorders striped>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Classe</Table.Th>
                            <Table.Th>Axes</Table.Th>
                            {centerColumns.map((col) => (
                                <Table.Th key={col}>{col}</Table.Th>
                            ))}
                            {pointColumns.map((col) => (
                                <Table.Th key={col}>{col}</Table.Th>
                            ))}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {
                            centers.map((_, idxCenter) => (
                                <>
                                    <Table.Tr>
                                        <Table.Td>{`Classe ${idxCenter + 1}`}</Table.Td>
                                        <Table.Td>{idxCenter == 0 ? "X" : "Y"}</Table.Td>

                                        {centers.map((center, idx) => (
                                            <Table.Td key={`class-${idxCenter}-center-${idx}-x`}>


                                                {idxCenter == 0 ? center.data[0]?.X.toFixed(0) : center.data[0]?.Y.toFixed(0)}
                                            </Table.Td>
                                        ))}


                                        {
                                            allPoints.map((point) => {

                                                const distances = centers.map((center, idx) => {
                                                    return { dis: euclideanDistance(new Pt(point.X, point.Y), new Pt(center.data[0].X, center.data[0].Y)), idxCenter: idx }
                                                }
                                                );


                                                const minDistance = distances.reduce((min, current) => {

                                                    const minDistance = Math.min(Number(min.dis), Number(current.dis))

                                                    return { dis: minDistance, idxCenter: distances.filter(idx => idx.dis === minDistance)[0].idxCenter }


                                                })

                                                return (<>
                                                    {minDistance.idxCenter == idxCenter ? <Table.Td  >
                                                        {point.X.toFixed(0)} <br />
                                                        {point.Y.toFixed(0)}


                                                    </Table.Td > : <Table.Td  >

                                                    </Table.Td >}
                                                </>)
                                            })
                                        }


                                    </Table.Tr >
                                </>

                            )
                            )
                        }


                    </Table.Tbody>
                </Table>
            </Box>
        </Paper >
    );
};

export default ClusterDataTable;