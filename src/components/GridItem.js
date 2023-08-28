import styled from '@emotion/styled';
import Paper from '@mui/material/Paper';

const GridItem = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  cursor: 'pointer',
}));

export default GridItem;
