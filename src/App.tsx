import { Container, createTheme, Divider, MantineProvider, NumberInput, Text } from '@mantine/core';
import '@mantine/charts/styles.css';

import '@mantine/core/styles.css';
import InteractiveScatterChart from './components/interactiveChart';
import { useState } from 'react';
function App() {


  const theme = createTheme({

  });


  const [k, setK] = useState<string | number>(2)
  const [maxIterations, setMaxIterations] = useState<string | number>(100);




  return (
    <>
      <MantineProvider theme={theme} defaultColorScheme="dark" >

        <Container my={100}  >

          <InteractiveScatterChart k={k} maxIterations={maxIterations} />


          <Divider labelPosition='left' size={'xl'} my={'xl'} label={<Text size='xl'>Settings</Text>} />


          <NumberInput
            size="xl"
            radius="md"
            label="number of Cluster"
            allowNegative={false}
            min={2}
            value={k}
            onChange={setK}
          />


          <NumberInput
            size="xl"
            radius="md"
            label="Max number of Iteration"
            allowNegative={false}
            value={maxIterations}
            onChange={setMaxIterations}
            min={2}
          />


        </Container>
      </MantineProvider>
    </>
  )
}


export default App
