import abi from "./abi.js";
import openCity from "./tab.js";
import list from "./tokenList.js";
const { ethers: etherjs } = ethers;

// console.log(list, abi, etherjs);

const rpcUrl = "https://goerli.infura.io/v3/ba80361523fe423bb149026a490266f0";
const signerProvider = new etherjs.providers.Web3Provider(window.ethereum);

const provider = new etherjs.providers.JsonRpcProvider(rpcUrl);

const signer = signerProvider.getSigner();

const tokenAddress = "0xC770d227Eb937D7D3A327e68180772571C24525F";

let connectedWallet;

const useContract = (address = tokenAddress, tokenAbi = abi, isSigner = false) => {
  const providerSigner = new etherjs.providers.Web3Provider(window.ethereum);
  const signer = providerSigner.getSigner();

  const provider = new etherjs.providers.JsonRpcProvider(rpcUrl);

  const newProvider = isSigner ? signer : provider;
  
  return new ethers.Contract(address, tokenAbi, newProvider);
};

// view functions
// new ethers.Contract(address, abi, provider)

//state  mutating functions
// new ethers.Contract(address, abi, signer)

const connectWallet = async () => {
  await signerProvider.send("eth_requestAccounts");
  await getUserWallet();
};

const getUserWallet = async () => {
  let userAddress = await signer.getAddress();
  //   connectedWallet = userAddress;
  updateUserAddress(userAddress);
  //   console.log(connectedWallet, "connected wallet");
};

export default {
  openCity,
};

// elements
const button = document.getElementById("connectBtn");
const userAddress = document.getElementById("userAddress");

// Event Listeners
button.addEventListener("click", connectWallet);

function updateUserAddress(address) {
  userAddress.innerText = address;
}

async function getTokenListDetails(tokenAddress, image) {
  await connectWallet();
  loader.innerText = "Loading...";
  let userAddress = await signer.getAddress();
  const token = await useContract(tokenAddress, abi);

  try {
    const [name, symbol, totalSupply, userBalance] = await Promise.all([token.name(), token.symbol(), token.totalSupply(), token.balanceOf(userAddress)]);
    console.log(name, symbol, totalSupply / 10 ** 18, userBalance / 10 ** 18);

    const template = tokenTemplateUpdate(name, symbol, totalSupply / 10 ** 18, `${userBalance / 10 ** 18} ${symbol}`, image, tokenAddress);

    htmlToken.innerHTML += template;

    //return { name, symbol, totalSupply: Number(totalSupply), userBalance };
  } catch (error) {
    errored.innerText = "Error Occurred!";
    console.log("error occurred", error);
  } finally {
    loader.innerText = "";
  }
}

async function displayTokenList() {
  list.tokens.map((token) => {
    getTokenListDetails(token.address, token.logoURI);
  });
}

displayTokenList();

let currentTokenData = {
  name: list.tokens[0].name,
  symbol: list.tokens[0].symbol,
  address: list.tokens[0].address
};
activeName.innerText = currentTokenData.name;
activeSymbol.innerText = currentTokenData.symbol;

function getAddress(tAddress, tName, tSymbol) {
  currentTokenData.name = tName;
  currentTokenData.symbol = tSymbol;
  currentTokenData.address = tAddress;
  console.log(currentTokenData);

  activeName.innerText = currentTokenData.name;
  activeSymbol.innerText = currentTokenData.symbol;

  openCity(event, 'Paris');
}



function tokenTemplateUpdate(name, symbol, totalSupply, userBalance, image, tokenAddress) {
  return `
    <div class="flex justify-between items-center mb-4" onclick="getAddress('${tokenAddress}', '${name}', '${symbol}')">
        <div>
            <div class="flex items-center">
                <div class="p-2 token-thumbnail w-10 h-10"> 
                    <img src="${image}" alt="token-img" />  </div>
                <div>
                    <p class="font-semibold">${name} - ${symbol} </p>
                    <p>Total Supply: ${totalSupply}</p>
                </div>
            </div>
        </div>
        <div>${userBalance}</div>
    </div>
  `;
}

/***
 * @amt - Number
 * @receiver - string
 **/
 async function sendToken(address, amt) {
  const contract = useContract(currentTokenData.address, abi, true);
  // console.log(contract);
  // const amount = new etherjs.utils.parseEthers();
  const decimal = await getDecimals();
  const parseUnit = new etherjs.utils.parseUnits(amt, decimal);
  const txn = await contract.transfer(address, parseUnit);
  console.log(txn, "transaction pending....");
  sendTransaction.innerText = "Sending";
  window.alert(`transaction pending....`);
  const confirm = await txn.wait();
  console.log("transaction ends", confirm);
  window.alert(`${amt} CLT sent to ${address}`);
  sendTransaction.innerText = "Send";
}

async function getDecimals() {
  const contract = useContract();
  return await contract.decimals();
}

sendTransaction.addEventListener("click", async () => {
  const amount = amt.value;
  const receiverAddress = receiver.value;
  console.log(amount, receiverAddress);

  await sendToken(receiver.value, amt.value);
});

window.getAddress = getAddress;