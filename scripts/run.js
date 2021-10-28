const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();

    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
    const waveContract = await waveContractFactory.deploy();
    await waveContract.deployed();

    console.log("Contract deployed to:", waveContract.address);
    console.log("Contracted deployed by:", owner.address);

    let waveTx 
    for (let i=0; i<100; i++) {
      if (getRandomIntInclusive(0, 1) === 0) {
        waveTx = await waveContract.wave()
        await waveTx.wait();
      } else {
        waveTx = await waveContract.connect(randomPerson).wave()
        await waveTx.wait()
      }
    }
    let waveCount1 = await waveContract.connect(randomPerson).getWavesByAddress();
    let waveCount2 = await waveContract.getWavesByAddress();

    console.log(waveCount1 > waveCount2 ? 'Random person wins!' : 'I win!')

    let totalWaveCount = await waveContract.getTotalWaves()

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