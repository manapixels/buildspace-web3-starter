const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();

  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  // Go and deploy my contract and fund it with 0.1 ETH
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
  });
  await waveContract.deployed();

  console.log("Contract address:", waveContract.address);
  console.log("Deployed by:", owner.address);

  /*
  * Get Contract Balance
  */
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );


  const waveTx = await waveContract.wave("This is wave #1")
  await waveTx.wait();
  // const waveTx2 = await waveContract.wave('This is wave #2');
  // await waveTx2.wait();

  // let waveTx 
  // for (let i=0; i<100; i++) {
  //   if (getRandomIntInclusive(0, 1) === 0) {
  //     waveTx = await waveContract.wave("Hello there!~")
  //     await waveTx.wait();
  //   } else {
  //     waveTx = await waveContract.connect(randomPerson).wave("I'm 'the' one")
  //     await waveTx.wait()
  //   }
  // }
  // let waveCount1 = await waveContract.connect(randomPerson).getWavesByAddress();
  // let waveCount2 = await waveContract.getWavesByAddress();
  //
  //console.log(waveCount1 > waveCount2 ? 'Random person wins!' : 'I win!')

  /*
 * Get Contract balance to see what happened!
 */
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allWaves = await waveContract.getAllWaves()
  console.log(allWaves);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}