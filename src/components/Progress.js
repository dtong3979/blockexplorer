import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import * as React from 'react';

export default function Progress(props) {
  const { color = 'success', width = 210, height = 60 } = props;
  return (
    <Stack
      sx={{ color: 'grey.500' }}
      spacing={2}
      direction="column"
      marginTop="1rem"
      alignItems="center"
    >
      <CircularProgress color={color} width={width} height={height} />
    </Stack>
  );
}
