import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Utils } from 'alchemy-sdk';
import { useState } from 'react';

import TransactionDetails from './TransactionDetails';

const TransactionTable = (props) => {
  const { transactions, alchemy } = props;

  const [open, setOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState('');

  const handleClickOpen = (e, transactionHash) => {
    e.preventDefault();
    setSelectedTransaction(transactionHash);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!transactions || !transactions.length) return <></>;

  return (
    <>
      <TableContainer component={Paper} style={{ marginTop: '1rem' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">No.</TableCell>
              <TableCell align="left">Hash</TableCell>
              <TableCell align="left">From</TableCell>
              <TableCell align="left">To</TableCell>
              <TableCell align="left">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx, index) => (
              <TableRow
                key={tx.hash}
                onClick={(e) => handleClickOpen(e, tx.hash)}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                style={{ cursor: 'pointer' }}
              >
                <TableCell align="left">{index + 1}</TableCell>
                <TableCell align="left">{tx.hash.substr(-10)}</TableCell>
                <TableCell align="left">{tx.from}</TableCell>
                <TableCell align="left">{tx.to}</TableCell>
                <TableCell align="left">
                  {Utils.formatEther(tx.value._hex.toString())} ETH
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TransactionDetails
        alchemy={alchemy}
        open={open}
        selectedTransaction={selectedTransaction}
        handleClose={handleClose}
      />
    </>
  );
};

export default TransactionTable;
