import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Utils } from 'alchemy-sdk';
import React from 'react';

import Progress from './Progress';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TransactionDetails(props) {
  const { alchemy, open, selectedTransaction, handleClose } = props;

  const [transactionDetails, setTransactionDetails] = React.useState();
  const [loadingTransactionDetails, setLoadingTransactionDetails] =
    React.useState(true);

  React.useEffect(() => {
    if (!selectedTransaction) return;

    const getTransactionReceipts = async () => {
      setLoadingTransactionDetails(true);
      const transactionReceipt = await alchemy.core.getTransactionReceipt(
        selectedTransaction
      );
      setTransactionDetails(transactionReceipt);
      setLoadingTransactionDetails(false);
    };

    getTransactionReceipts();
  }, [alchemy, selectedTransaction]);

  const viewTransactionOnchain = (e, transactionHash) => {
    e.preventDefault();
    window.open(
      `https://etherscan.io/tx/${transactionHash}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Transaction details
            </Typography>
          </Toolbar>
        </AppBar>
        {loadingTransactionDetails ? (
          <Progress color="secondary" />
        ) : (
          <Card
            // sx={{ maxWidth: 1024 }}
            onClick={(e) =>
              viewTransactionOnchain(e, transactionDetails?.transactionHash)
            }
            style={{ cursor: 'pointer' }}
          >
            <CardHeader
              title={`Transaction hash: ${transactionDetails?.transactionHash}`}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {`Block number: ${transactionDetails?.blockNumber}`}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                marginTop="15px"
              >
                {`Transaction index: ${transactionDetails?.transactionIndex}`}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                marginTop="15px"
              >{`From: ${transactionDetails?.from}`}</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                marginTop="15px"
              >{`To: ${transactionDetails?.to}`}</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                marginTop="15px"
              >{`Gas used: ${Utils.formatEther(
                transactionDetails?.gasUsed?._hex?.toString() || 0
              )} ETH`}</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                marginTop="15px"
              >{`Cummulative gas used: ${Utils.formatEther(
                transactionDetails?.cumulativeGasUsed?._hex?.toString() || 0
              )} ETH`}</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                marginTop="15px"
              >{`Effective gas spanrice: ${Utils.formatEther(
                transactionDetails?.effectiveGasspanrice?._hex?.toString() || 0
              )} ETH`}</Typography>
            </CardContent>
          </Card>
        )}
      </Dialog>
    </div>
  );
}
