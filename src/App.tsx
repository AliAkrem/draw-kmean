import { Anchor, AppShell, Burger, Container, createTheme, Divider, Group, MantineProvider, NumberInput,  Text, Title } from '@mantine/core';
import '@mantine/charts/styles.css';

import '@mantine/core/styles.css';
import InteractiveScatterChart from './components/interactiveChart';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';


function App() {



  const theme = createTheme({

  });


  const [k, setK] = useState<string | number>(2)
  const [maxIterations, setMaxIterations] = useState<string | number>(100);

  const [opened, { toggle }] = useDisclosure();


  return (
    <>
      <MantineProvider theme={theme} defaultColorScheme="dark" >

        <AppShell
          layout="alt"
          header={{ height: 60 }}
          footer={{ height: 60 }}
          navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !opened } }}
          padding="md"
        >
          <AppShell.Header>
            <Group h="100%" px="md">
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              <Title>K-means playground</Title>
            </Group>
          </AppShell.Header>

          <AppShell.Navbar p="md">
            <Group>
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              <Divider labelPosition='left' size={'xl'} my={'xl'} label={<Text size='xl'>Settings</Text>} />
            </Group>


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
          </AppShell.Navbar>
          <AppShell.Main>
            <Container my={100}  >

                <InteractiveScatterChart k={k} maxIterations={maxIterations} />


            </Container>
          </AppShell.Main>

          <AppShell.Footer p="md">Developer<Anchor href='https://github.com/aliAkrem' > @AliAkrem</Anchor></AppShell.Footer>
        </AppShell>



      </MantineProvider>
    </>
  )
}


export default App
