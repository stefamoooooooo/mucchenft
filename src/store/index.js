import Vue from "vue";
import Vuex from "vuex";
const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const EahpJs = require("eahp-js");
const pinataSDK = require("@pinata/sdk");
const pinata = pinataSDK(
  "076cca4f7dda4eed3a76",
  "72df3249903924129b0b0890b1a177b8ebd3d2e0e66579820d8baa6285d5d6c2"
);
//import HDWalletProvider from '@truffle/hdwallet-provider';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    web3: null,
    web3pub: null,
    token: null,
    miachiave:
      "caa99c202210623629e7639ee885b83c84132a7ac4f1e3e2e2857f5eaecb0ab1",
    user: {
      CF: "",
      pk: "",
      address: "",
      logged: false,
      role: "", //allevatore o cliente
      NFTs: [], //nft di proprietà dell'address loggato
    },
    cowsList: [],
    datiAllevatori: [
      {
        nome: "CIBRARIO",
        cf: "CBRMRC54T06E216D",
        address: "0x829448fFb75E727aAe43ea8Cf75B2322B6E89B95",
        mucche: [],
        nft: [],
      },
      {
        nome: "BERMOND",
        cf: "BRMDNL62C07C564I",
        address: "0x0423cFBFdA5CDdab4F6777B6F1EEd92830F1e685", //"0xE73FE4313709EbE78B7e7fe9B30b85B88Dd333C8",
        mucche: [],
        nft: [],
      },
    ],
  },

  mutations: {
    saveMucche: (state, mucche) => (state.cowsList = mucche),
    saveMuccheIn: (state, data) =>
      (state.datiAllevatori[data.index].mucche = data.res),
    saveWeb3: (state, web3) => (state.web3 = web3),
    saveWeb3pub: (state, web3pub) => (state.web3pub = web3pub),
    saveToken: (state, token) => (state.token = token),
    saveUser: (state, payload) => (
      (state.user.pk = payload.userAccount.privateKey),
      (state.user.address = payload.userAccount.address),
      (state.user.CF = payload.userCF),
      (state.user.logged = true)
    ),
    loginFailed: (state) => (state.user.logged = false),
  },

  actions: {
    initWeb3({ commit }, pk) {
      const blockchainURL =
        "https://app.pinin-project.eu/andromeda-services/eahp";

      let validFrom = new Date().getTime() - 1000 * 60;
      let validTo = new Date().getTime() + 1000 * 60 * 10;

      let token = EahpJs.generateConnectionUrl(
        blockchainURL,
        pk,
        validFrom,
        validTo
      );
      token = token.split("/");
      token = token[token.length - 1];

      const web3 = new Web3(
        new HDWalletProvider(
          pk,
          EahpJs.generateConnectionUrl(blockchainURL, pk, validFrom, validTo)
        )
      );

      commit("saveWeb3", web3);
      commit("saveToken", token);
    },

    initWeb3Pub({ commit }) {
      const blockchainURL = "https://co3-pantheon.di.unito.it:7545";
      const web3pub = new Web3(
        new HDWalletProvider(this.state.miachiave, blockchainURL)
      );
      commit("saveWeb3pub", web3pub);
    },

    async mintTx({ context }, payload) {
      const contractAddress = "0x27fDccF2933d1755b9ee42981dE30d55F6Cc500C";
      const contractAbi = [
        {
          inputs: [
            {
              internalType: "string",
              name: "tokenName",
              type: "string",
            },
            {
              internalType: "string",
              name: "symbol",
              type: "string",
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
          inputs: [
            {
              internalType: "address",
              name: "recipient",
              type: "address",
            },
          ],
          name: "checkExist",
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
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "ids",
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
          name: "listOfAddress",
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
              internalType: "address",
              name: "recipient",
              type: "address",
            },
            {
              internalType: "string",
              name: "metadata",
              type: "string",
            },
          ],
          name: "mintToken",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
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
              internalType: "bytes4",
              name: "interfaceId",
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
          name: "totalOwner",
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
      ];

      const contract = new this.state.web3pub.eth.Contract(
        contractAbi,
        contractAddress
      );
      let beforeMint = await contract.methods
        .balanceOf(this.state.user.address)
        .call();
      console.log("Bilancio NFT prima del mint: ", beforeMint);

      let res = await contract.methods
        .mintToken(payload.from, payload.metadata)
        .send({
          from: this.state.user.address,
          gasPrice: "0",
          gasLimit: "1000000",
        });
      console.log("dati transazione --->  ", res);

      let afterMint = await contract.methods
        .balanceOf(this.state.user.address)
        .call();
      console.log("Bilancio NFT dopo del mint: ", afterMint);
    },

    async getAllevatoreByAddress({ dispatch, commit }, pk) {
      let account = this.state.web3.eth.accounts.privateKeyToAccount(pk);

      //0xE73FE4313709EbE78B7e7fe9B30b85B88Dd333C8 -> addres allevatore

      let res = fetch(
        "https://app.pinin-project.eu/andromeda-services/registry/contacts?address=" +
          "0xE73FE4313709EbE78B7e7fe9B30b85B88Dd333C8" +
          "&limit=10&offset=0&sort=id.asc",
        {
          //DA METTERE LINK REGIONALE DI
          mode: "cors",

          headers: {
            Accept: "*/*",

            Authorization: "eahp " + this.state.token,
          },
        }
      )
        .then((res) => {
          res = res
            .json()
            .then((res) => {
              if (res[0]) {
                let payload = {
                  userAccount: account,
                  userCF: res[0].name.split("-")[1],
                };

                commit("saveUser", payload);
                //console.log("LOGGATO")
                dispatch("getMuccheOf", this.state.user.CF);
              } else {
                commit("loginFailed");
                //console.log("LOGIN FALLITO")
              }
            })
            .catch((e) => console.log(e));
        })
        .catch((e) => {
          console.log(e);
        });
    },

    async getMuccheOf({ commit }, cf) {
      try {
        const bdnJSON = require("pinin-fondieuropei-json/json/StorageBDNGET_AEV2.json");

        const contractAddress = "0x0d231e9431f67a1b32aa5275d83eb1405c6cec0f";

        const contract = new this.state.web3.eth.Contract(
          bdnJSON.abi,
          contractAddress
        );

        var test = await contract.methods.getBovini(cf, 1, 0).call(); //in lettura .call(), in scrittura .send()

        this.state.web3.currentProvider.engine.stop();

        commit("saveMucche", test);
      } catch (e) {
        console.log(e);
      }
    },

    async getMucche({ commit }) {
      /*
      const bdnJSON = require("pinin-fondieuropei-json/json/StorageBDNGET_AEV2.json") 
      
      const contractAddress = "0x0d231e9431f67a1b32aa5275d83eb1405c6cec0f" 
  
      const contract = new this.state.web3.eth.Contract(bdnJSON.abi, contractAddress)

      const metadataFilter = {
            
      };

      const filters = {
          status : 'pinned',
          pageLimit: 10,
          pageOffset: 0,
          metadata: metadataFilter
      };

      let pinnedList = await pinata.pinList(filters)
      console.log("PINNEDLIST --> ",pinnedList)

      for (let i = 0; i < this.state.datiAllevatori.length; i++){
        try{

          var test = await contract.methods.getBovini(this.state.datiAllevatori[i].cf, 1, 0).call() //in lettura .call(), in scrittura .send()
          
          this.state.web3.currentProvider.engine.stop()

          let data = {
            res: test,
            index: i
          }

          pinnedList.rows.forEach(element => {
            if (element.metadata.name !== "Muccaa.png") {
              if (element.metadata.keyvalues.breeder == this.state.datiAllevatori[i].cf && !this.state.datiAllevatori[i].nft.includes(element.metadata.name))
                this.state.datiAllevatori[i].nft.push(element.metadata.name)
            }
          });

          commit("saveMuccheIn", data)
  
        } catch(e) {
          console.log(e)
        }
      }*/

      const contractAddress = "0x27fDccF2933d1755b9ee42981dE30d55F6Cc500C";
      const contractAbi = [
        {
          inputs: [
            {
              internalType: "string",
              name: "tokenName",
              type: "string",
            },
            {
              internalType: "string",
              name: "symbol",
              type: "string",
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
          inputs: [
            {
              internalType: "address",
              name: "recipient",
              type: "address",
            },
          ],
          name: "checkExist",
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
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "ids",
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
          name: "listOfAddress",
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
              internalType: "address",
              name: "recipient",
              type: "address",
            },
            {
              internalType: "string",
              name: "metadata",
              type: "string",
            },
          ],
          name: "mintToken",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
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
              internalType: "bytes4",
              name: "interfaceId",
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
          name: "totalOwner",
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
      ];

      const contract = new this.state.web3pub.eth.Contract(
        contractAbi,
        contractAddress
      );

      //let totalOwner = await contract.methods.totalOwner().call()

      //console.log("TOTAL OWNER: ", totalOwner)

      //let addressOwner = []
      /*for (let i = 0; i < totalOwner; i++){
        let address = await contract.methods.listOfAddress(i).call()
        if (!addressOwner.includes(address)){
          addressOwner.push(address)
        }

        var metadata = []
        
        let balance = await contract.methods.balanceOf(address).call()
        for (let i = 0; i < balance; i++) {
          let id = await contract.methods.ids(address, i).call()
          let link = await contract.methods.tokenURI(id).call()
          link = link.split("//")[1]
          metadata.push(link)
        }
        console.log("METADATA LINKS DI ", address, ": ", metadata)
      }*/

      for (let i = 0; i < this.state.datiAllevatori.length; i++) {
        console.log("giro ", i);
        var metadata = [];

        let balance = await contract.methods
          .balanceOf(this.state.datiAllevatori[i].address)
          .call();
        console.log("balance ", i, "  ", balance);
        for (let j = 0; j < balance; j++) {
          let id = await contract.methods
            .ids(this.state.datiAllevatori[i].address, j)
            .call();
          let link = await contract.methods.tokenURI(id).call();
          link = link.split("//")[1];
          metadata.push(link);
        }
        console.log(
          "METADATA LINKS DI ",
          this.state.datiAllevatori[i].address,
          ": ",
          metadata
        );

        for (let k = 0; k < metadata.length; k++) {
          let json = await fetch(
            "https://gateway.pinata.cloud/ipfs/" + metadata[k]
          );
          let res = await json.json();
          console.log(res);

          let already = false;
          this.state.datiAllevatori[i].nft.forEach((element) => {
            if (element["marca auricolare"] == res["marca auricolare"])
              already = true;
          });

          if (!already) this.state.datiAllevatori[i].nft.push(res);
        }
      }

      //console.log("ADDRESS CHE POSSEGGNONO ALMENO 1 NFT: ", addressOwner)

      this.state.web3pub.currentProvider.engine.stop();
    },
  },

  modules: {},
});
