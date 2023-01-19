var abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        internalType: "string",
        name: "baseURI_",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_maxBatchSize",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_controller",
        type: "address",
      },
      {
        internalType: "address",
        name: "_companyAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bps",
        type: "uint256",
      },
    ],
    name: "Mint",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "_itemsSold",
    outputs: [
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "baseURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_quantity",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_tokenURI",
        type: "string",
      },
      {
        internalType: "address",
        name: "royaltyRecipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "royaltyValue",
        type: "uint256",
      },
    ],
    name: "batchmint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "checkSecondarySale",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "creators",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getBatchMaxSize",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "isSecondarySale",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "string",
        name: "_tokenURI",
        type: "string",
      },
      {
        internalType: "address",
        name: "royaltyRecipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "royaltyValue",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "royaltyInfo",
    outputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "royaltyAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "baseURI_",
        type: "string",
      },
    ],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "setSecondarySale",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newPrice",
        type: "uint256",
      },
    ],
    name: "setUpdatePrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "_interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenURIPrefix",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_tokenURI",
        type: "string",
      },
    ],
    name: "updateTokenURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

var showError = function () {
  $(".koopon-button").after(
    '<div class="dealmintr-error" style="text-align: center; margin-top: 10px; color: rgb(200 30 30); background: rgb(253 232 232); border-radius: 4px; display: block; padding: 10px; width: 100%"><strong>Failed. Please contract the shop owner</strong></div>'
  );
  $(".koopon-button").hide();
}

var onResale = async function (userAddress, collectionAddress) {
  const dealmintrWalletAddress = "0x9C17D38551bC383C5Ce2049Bb84ea568c02Ad836";
  let transferName = "safeTransferFrom(address from, address to, uint256 tokenId)";
  let mintName = "mint(address _to,string _tokenURI,address royaltyRecipient,uint256 royaltyValue,uint256 _price)";
  let from =dealmintrWalletAddress
  let to =collectionAddress
  const txData = await axios.get(`https://api-testnet.polygonscan.com/api?module=account&action=txlist&address=${userAddress}&sort=desc&apikey=6XVQ6WYBW498526S3GJB5MDST1IZPQERFT`)
   .then((response) =>{
     const data = response.data.result;
     const newData=[]
     if(data){
       for(let i=0;i<data.length;i++){
         if((data[i].from == from && data[i].to == to) || data[i].functionName == transferName || data[i].functionName == mintName){
           newData.push(data[i])
         }
       }
     }
     return newData;
   })

   for(let j=0;j<txData.length;j++){
      for(let k=0;k<j;k++){
       if(txData[j].timeStamp < txData[k].timeStamp){
         var x = txData[j];
         txData[j] = txData[k];
         txData[k] = x;
       }
      }
   }

   const finalTxData = txData[0]
   if(finalTxData){
     if(finalTxData.from == from){
       return true
     } else{
       return false
     }
   }
}

var connect = async function () {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId != web3.utils.toHex(80001)) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x13881' }]
        });
      } catch (error) {
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {   
                  chainId: '0x13881',
                  chainName: 'Polygon Mumbai Testnet',
                  rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                  nativeCurrency: {
                      name: "Mumbai Matic",
                      symbol: "MATIC",
                      decimals: 18
                  },
                  blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
                },
              ],
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const account = window.web3.eth.accounts;
    //Get the current MetaMask selected/active wallet
    const walletAddress = account.givenProvider.selectedAddress;
    console.log(`Wallet: ${walletAddress}`);
    console.log("Getting tokens");
    if (window.DealMintr.appSettings.length) {
      let collectionAddresses = window.DealMintr.appSettings
        .filter((setting) => {
          return window.web3.utils.isAddress(setting.contractAddress);
        })
        .map((setting) => {
          return setting.contractAddress;
        });
      console.log(collectionAddresses);
      if (window.DealMintr.appConfig.noResale) {
        collectionAddresses = await Promise.all(collectionAddresses.map(async (collectionAddress) => {
          let isResale = await onResale(walletAddress, collectionAddress);
          if (!isResale) {
            return collectionAddress;
          }
          return "";
        }));
        collectionAddresses = collectionAddresses.filter((collectionAddress) => collectionAddress.length > 0);
      }
      await getTokenMetas(collectionAddresses, walletAddress);
    }
  } else {
    console.log("No wallet");
  }
};

var getTokenMetas = async function (collectionAddresses, userWalletAddress) {
  let web3 = new Web3(window.web3.currentProvider);
  let nftDatas = [];
  for (let i = 0; i < collectionAddresses.length; i++) {
    let nftContract = new web3.eth.Contract(abi, collectionAddresses[i]);

    const tokenBalance = await nftContract.methods
      .balanceOf(userWalletAddress)
      .call();

    let tokenData = [];

    for (let j = 0; j < tokenBalance; j++) {
      let tokenId = await nftContract.methods
        .tokenOfOwnerByIndex(userWalletAddress, j)
        .call();
      let tokenMetadataURI = await nftContract.methods.tokenURI(tokenId).call();
      console.log(tokenMetadataURI);
      let response = await axios.get(tokenMetadataURI);
      tokenData.push(response.data);
    }

    nftDatas.push({
      key: collectionAddresses[i],
      value: tokenData,
    });
  }

  console.log("nft datas...", nftDatas);

  window.DealMintr.nftDatas = nftDatas;
};

var checkNft = async function () {
  let { appSettings, nftDatas } = window.DealMintr;
  if (!nftDatas.length) {
    showError();
    return;
  }
  let variantIds = [];
  appSettings.forEach((setting) => {
    let data = nftDatas.find((d) => {
      return d.key == setting.contractAddress;
    });
    console.log(data);
    if (!data || !data.hasOwnProperty("value")) {
      console.log("here 0.5")
      return;
    }
    let nfts = data.value;
    let find = nfts.find((nft) => {
      if (!nft.hasOwnProperty("attributes")) {
        return;
      }
      let attributes = nft.attributes;
      let timestamp = _.find(attributes, (att) => {
        return att.trait_type == "release date";
      });
      if (!timestamp) {
        return;
      }
      timestamp = timestamp.value;
      return (nft.symbol = setting.symbol && nft.name == setting.name && timestamp == setting.timestamp);
    });
    if (!find) {
      console.log("here 1");
      return;
    }
    variantIds.push({
      id: setting.product,
      quantity: 1,
      properties: {
        "_nftSymbol": setting.symbol
      }
    });
  });
  if (!variantIds.length) {
    $(".koopon-button").html("Not Found");	
    setTimeout(function() {	
      $(button).prop("disabled", false);	
      $(button).text("Add Koopon");	
    }, 5000);
    return;
  }
  console.log("variantIds", variantIds);
  let cart = await $.get("/cart.json", function(data) {
    let items = [];
    console.log("cart", data);
    if (!data.items.length) {
      items = variantIds;
    } else {
      variantIds.forEach((v) => {
        let find = data.items.find((item) => {
          return item.variant_id == v.id
        });
        if (find) {
          console.log("here 2")
          return;
        }
        items.push(v);
      });
    }
    console.log("items", items);
    if (!items.length) {
      console.log("here 3");
      showError();
      return;
    }
    $.post("/cart/add.js", {items}, function(data) {
      location.reload();
    });
  });
};

var initApp = async function (settings, config) {
  if (!settings || !config) {
    return;
  }
  window.DealMintr.appSettings = settings;
  window.DealMintr.appConfig = config;
  if ($('.koopon-button').length == 0) {
    let button = "<button class='button btn koopon-button'>Add Koopon</button>";
    let $form = $("form[action='/cart']");
    if ($form.find("table tbody tr").length) {
      $form.after(button);
      $form.after("<style>.koopon-button {margin: 1rem 0;display: block;}</style>");
    } else {
      $form.before("<style>.koopon-button {margin: 1rem auto;display: block;}</style>")
      $form.before(button);
    }
  }
  $(document).on("click", ".koopon-button", async function (e) {
    e.preventDefault();
    var button = $(this);
    $(this).prop("disabled", true);
    $(this).html("Checking");
    if (typeof window.ethereum == 'undefined') {	
      $(this).html("Install Metamask");	
      setTimeout(function() {	
        $(button).prop("disabled", false);	
        $(button).text("Add Koopon");	
      }, 5000);	
      return;	
    }
    await connect();
    await checkNft();
  });
};

$(document).ready(async function () {
  $.ajax({
    type: "post",
    url: "https://dealmintr.simesy.com/api/get_settings",
    data: {
      shop: Shopify.shop,
    },
    success: function (data) {
      initApp(data.data.settings, data.data.config);
    },
  });
});