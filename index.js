const { Obi } = require('@bandprotocol/obi.js');
const BandChain = require('@bandprotocol/bandchain.js');

// BandChain Devnet REST endpoint
const endpoint = 'http://guanyu-devnet.bandchain.org/rest';
// Mnemonic to use to make requests
const mnemonic =
  'final little loud vicious door hope differ lucky alpha morning clog oval milk repair off course indicate stumble remove nest position journey throw crane';

// Declare the variables
// Note: Requests made using the devnet explorer (https://guanyu-devnet.cosmoscan.io) is set to use minCount = 4 and askCount = 4
// minCount: the minimum number of BandChain's validators that responds for us to consider the request successful
// askCount: the maximum number of validators that we want to respond to the request
minCount = 4;
askCount = 4;

(async () => {
  // PAXG Price oracle script ID
  let oracleScriptID = 67;

  // Initiate `BandChain` object to be used when making requests
  let bandchain = new BandChain(endpoint);

  // Get oracle script info
  let oracleScript = await bandchain.getOracleScript(oracleScriptID);

  const obi = new Obi(oracleScript.schema);

  // Submit a request transaction
  console.log('🚀 Submitting a new request');
  let requestID = await bandchain.submitRequestTx(
    oracleScript,
    { multiplier: BigInt('1000000') },
    { minCount: 4, askCount: 4 },
    mnemonic
  );
  // Retrieve the previous request's results
  let requestResult = await bandchain.getRequestResult(requestID);
  // Decode and print the result
  let encodedOutput = requestResult.ResponsePacketData['result'];
  let decodedOutput = obi.decodeOutput(Buffer.from(encodedOutput, 'base64'));
  console.log('Request Result: ', decodedOutput);

  console.log('-'.repeat(100));

  // Asking for a request with the previously requested parameters
  console.log('⏳ Fetching the latest request that match specified parameters');
  let matchingResult = await bandchain.getLastMatchingRequestResult(
    oracleScript,
    { multiplier: BigInt('1000000') },
    { minCount: 4, askCount: 4 }
  );
  console.log('Last Matching Request Result: ', matchingResult['result']);
})();
