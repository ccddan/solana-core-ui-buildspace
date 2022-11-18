import { useState } from 'react';

import type { NextPage } from 'next';

import * as Web3 from '@solana/web3.js';

import AddressForm from '../components/AddressForm';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const [balance, setBalance] = useState(0)
  const [address, setAddress] = useState('')
  const [executable, setExecutable] = useState('')

  const addressSubmittedHandler = async (address: string) => {
    let connection: Web3.Connection
    let key: Web3.PublicKey

    try {
      connection = new Web3.Connection(Web3.clusterApiUrl('devnet'))
      key = new Web3.PublicKey(address)
    } catch (error) {
      console.error('Failed to initialize account/connection:', error)
      return
    }

    try {
      setAddress(address)
      let balance = await connection.getBalance(key)
      setBalance(balance / Web3.LAMPORTS_PER_SOL)
    } catch (error) {
      setAddress('')
      setBalance(0)
      alert(error)
    }

    try {
      const accountInfo = await connection.getAccountInfo(key)
      console.log('Account info:', accountInfo)
      setExecutable(accountInfo!.executable)
    } catch (error) {
      console.error('Failed to retrieve account info:', error)
    }
  }

  return (
    <div className={styles.App}>
      <header className={styles.AppHeader}>
        <p>
          Start Your Solana Journey
        </p>
        <AddressForm handler={addressSubmittedHandler} />
        <p>{`Address: ${address}`}</p>
        <p>{`Balance: ${balance} SOL`}</p>
        <p>{`Smart Contract: ${executable}`}</p>
      </header>
    </div>
  )
}

export default Home
