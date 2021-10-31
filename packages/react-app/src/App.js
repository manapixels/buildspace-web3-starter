import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from './utils/WavePortal.json';
import './App.css';

export default function App() {

  const [currentAccount, setCurrentAccount] = useState('')
  const [isFetching, setIsFetching] = useState(false)
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState('')
  const [allWaves, setAllWaves] = useState([])
  const contractAddress = '0x6100A300bBEfB51c6e639efAc45A30de8aE23eE3'
  const contractABI = abi.abi;

  useEffect(() => {
    let wavePortalContract

    const onNewWave = (from, message, timestamp) => {
      /*
      * Add new wave to list
      */
      // console.log('NewWave', from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    const checkIfWalletIsConnected = async () => {
      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
        getAllWaves()
      } else {
        console.log("No authorized account found")
      }
    }

    /*
    * Check if there's Metamask
    */
    if (window.ethereum) {
      console.log("We have the ethereum object", window.ethereum);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on('NewWave', onNewWave);

      checkIfWalletIsConnected()
    } else {
      console.log("Make sure you have metamask!");
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off('NewWave', onNewWave);
      }
    };
  }, [])

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async (message = "") => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */

        setIsFetching(true)

        const waveTx = await wavePortalContract.wave(message, { gasLimit: 300000 });
        console.log(`Mining... ${waveTx}`);
        setStatus(`Mining... ${waveTx}`)

        await waveTx.wait();
        console.log("Mined -- ", waveTx.hash);

        setIsFetching(false)

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setStatus(`Mined -- ${waveTx.hash}. Total wave count: ${count.toNumber()}`)
        getAllWaves()

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
      setIsFetching(false)
    }
  }
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <label>Message:</label>
        <textarea onChange={(e) => setMessage(e.target.value)} />

        <button className="waveButton" onClick={() => wave(message)} disabled={isFetching}>
          {isFetching ? 'Waving...' : 'Wave at Me'}
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {status}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}
