import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';
import GridItem from './components/GridItem';
import Progress from './components/Progress';
import TransactionTable from './components/TransactionTable';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [prevBlockNumber, setPrevBlockNumber] = useState();
  const [nextBlockNumber, setNextBlockNumber] = useState();
  const [listTransactions, setListTransactions] = useState([]);
  const [loadingListTransactions, setLoadingListTransactions] = useState(true);

  useEffect(() => {
    async function getBlockNumber() {
      const currentBlockNumber = await alchemy.core.getBlockNumber();
      setPrevBlockNumber(currentBlockNumber - 1);
      setBlockNumber(currentBlockNumber);
      setNextBlockNumber(currentBlockNumber + 1);
      getBlockWithTransactions(currentBlockNumber);
    }

    getBlockNumber();
  }, []);

  useEffect(() => {
    alchemy.ws.on('block', (blockNumber) => {
      console.log('The latest block number is', blockNumber);
      setBlockNumber(blockNumber);
      setPrevBlockNumber(blockNumber - 1);
      setNextBlockNumber(blockNumber + 1);
    });

    return alchemy.ws.off('block', (blockNumber) =>
      console.log('The latest block number is', blockNumber)
    );
  });

  const getBlockWithTransactions = async (blockNumber) => {
    setLoadingListTransactions(true);
    const blockWithTxs = await alchemy.core.getBlockWithTransactions(
      blockNumber
    );
    console.log(JSON.stringify(blockWithTxs));
    setListTransactions(blockWithTxs?.transactions || []);
    setLoadingListTransactions(false);
  };

  const handleGetListOfTransaction = async (e, blockNumber) => {
    e.preventDefault();
    getBlockWithTransactions(blockNumber);
  };

  return (
    <Box sx={{ flexGrow: 1 }} style={{ margin: '1rem' }}>
      <Grid container spacing={4}>
        <Grid xs item>
          <GridItem>
            <span
              onClick={(e) => handleGetListOfTransaction(e, prevBlockNumber)}
            >
              Previous Block Number: {prevBlockNumber}
            </span>
          </GridItem>
        </Grid>
        <Grid xs={6} item>
          <GridItem onClick={(e) => handleGetListOfTransaction(e, blockNumber)}>
            Block Number: {blockNumber}
          </GridItem>
        </Grid>
        <Grid xs item>
          <GridItem>
            <span
              onClick={(e) => handleGetListOfTransaction(e, nextBlockNumber)}
            >
              Next Block Number: {nextBlockNumber}
            </span>
          </GridItem>
        </Grid>
      </Grid>
      {loadingListTransactions ? (
        <Progress />
      ) : (
        <TransactionTable alchemy={alchemy} transactions={listTransactions} />
      )}
    </Box>
  );
}

export default App;
