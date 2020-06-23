const BandChain = require('@bandprotocol/bandchain.js');

// Declare variables needed
// NOTE: chainID will be retrievable from a function in the next update to solve the issue of having
// to manually update following the devnet upgrade every two weeks
const chainID = 'band-guanyu-devnet-2.5';
const endpoint = 'http://guanyu-devnet.bandchain.org/rest';
const mnemonic =
  'final little loud vicious door hope differ lucky alpha morning clog oval milk repair off course indicate stumble remove nest position journey throw crane';

(async () => {
  let oracleScriptID = 1;
  let bandchain = new BandChain(chainID, endpoint);
  let oracleScript = await bandchain.getOracleScript(oracleScriptID);

  // Submit a request transaction
  let requestID = await bandchain.submitRequestTx(
    oracleScript,
    { symbol: 'BTC', multiplier: BigInt('1000000') },
    { minCount: 2, askCount: 4 },
    mnemonic
  );
  console.log('requestID: ' + requestID);

  // Retrieve the previous request's results
  let requestResult = await bandchain.getRequestResult(requestID);
  console.log('request result: ' + requestResult);

  // Asking for a request with the previously requested parameters
  let matchingResult = await bandchain.getLastMatchingRequestResult(
    oracleScript,
    { symbol: 'BTC', multiplier: BigInt('1000000') },
    { minCount: 2, askCount: 4 }
  );
  console.log('matching result: ' + matchingResult);
})();
