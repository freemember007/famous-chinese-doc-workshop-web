import React from 'react';
import { Grid, GridItem } from 'styled-grid-component';

export default () => (
  <Grid
    width="100%"
    height="100vh"
    templateColumns="repeat(3, 1fr)"
    gap="10px"
    autoRows="minmax(100px, auto)"
  >
    <GridItem column="1 / 3" row="1">
      <h1>Hello</h1>
    </GridItem>
    <GridItem column="2 / 4" row="1 / 3" className="red">
      <h1>World!</h1>
    </GridItem>
  </Grid>
);
