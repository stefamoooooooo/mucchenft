import Vue from 'vue'
import Vuex from 'vuex'
//import HDWalletProvider from '@truffle/hdwallet-provider';


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    web3: null,
    token: null,
    miachiave: "caa99c202210623629e7639ee885b83c84132a7ac4f1e3e2e2857f5eaecb0ab1",
    user: {
      CF: "",
      pk: "",
      address: "",
      logged: false,
      role: "", //allevatore o cliente
      NFTs: []  //nft di proprietà dell'address loggato
    },
    cowsList: [],
  },
  
  mutations: {
    saveMucche:(state, mucche) => (state.cowsList = mucche),
    saveWeb3:(state, web3) => (state.web3 = web3),
    saveToken:(state, token) => (state.token = token),
    saveUser:(state, payload) => (state.user.pk = payload.userAccount.privateKey, state.user.address = payload.userAccount.address, state.user.CF = payload.userCF, state.user.logged = true),
    loginFailed:(state) => (state.user.logged = false)
  },

  actions: {
    initWeb3({commit}, pk){
      const EahpJs = require('eahp-js');
      const Web3 = require("web3")
      const HDWalletProvider = require("@truffle/hdwallet-provider");
      const blockchainURL = "https://app.pinin-project.eu/andromeda-services/eahp"

      let validFrom = new Date().getTime() - (1000*60)
      let validTo = new Date().getTime() + (1000*60*10)

      let token = EahpJs.generateConnectionUrl(blockchainURL, pk, validFrom, validTo)
      token = token.split("/")
      token = token[token.length - 1]

      const web3 = new Web3(new HDWalletProvider(pk, EahpJs.generateConnectionUrl(blockchainURL, pk,validFrom, validTo)))

      commit("saveWeb3", web3)
      commit("saveToken", token)
    },

    async mintTx({context}, payload){
      
      // const Web3 = require("web3")
      // const EahpJs = require('eahp-js');
      // const blockchainURL = "https://app.pinin-project.eu/andromeda-services/eahp"
      // let validFrom = new Date().getTime() - (1000*60)
      // let validTo = new Date().getTime() + (1000*60*10)

      // let eahp = EahpJs.generateConnectionUrl(blockchainURL, "caa99c202210623629e7639ee885b83c84132a7ac4f1e3e2e2857f5eaecb0ab1", validFrom, validTo)
      // let token = eahp.split("/")
      // token = token[token.length - 1]

      //let tokenGenerato = "http://108.129.31.167:8080/andromeda-services/eahp/sealer-001/1.1qp21wcelh2wax4q9daibxsl6m9flzr.ku3wjqjc.o56nogbc.2l6kycv9e4az0abr7756cnflrcpzhv6ymkhxqf5ka0n03q55e9.xt7fsud91pvhjvcz5cacbv8iykap1mkan5l0c80ht71ypgpji.s"
      
      //const web3 = new Web3(new Web3.providers.HttpProvider(tokenGenerato));
      //const web3 = new Web3(new HDWalletProvider("caa99c202210623629e7639ee885b83c84132a7ac4f1e3e2e2857f5eaecb0ab1", eahp));
      const contractAddress = "0x4e0A9b9694AF6d3121E1D282fd3A90a83a2f3c15"
      const contractAbi = [
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "tokenName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "symbol",
              "type": "string"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "approved",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "Approval",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "operator",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "approved",
              "type": "bool"
            }
          ],
          "name": "ApprovalForAll",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "previousOwner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "OwnershipTransferred",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "Transfer",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "approve",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "name": "balanceOf",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "getApproved",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "operator",
              "type": "address"
            }
          ],
          "name": "isApprovedForAll",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "recipient",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "hash",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "metadata",
              "type": "string"
            }
          ],
          "name": "mintToken",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "name",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "ownerOf",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "renounceOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "safeTransferFrom",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "_data",
              "type": "bytes"
            }
          ],
          "name": "safeTransferFrom",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "operator",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "approved",
              "type": "bool"
            }
          ],
          "name": "setApprovalForAll",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes4",
              "name": "interfaceId",
              "type": "bytes4"
            }
          ],
          "name": "supportsInterface",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "symbol",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "tokenURI",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "transferFrom",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "transferOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]
      
      const contract = new this.state.web3.eth.Contract(contractAbi, contractAddress)
      let beforeMint = await contract.methods.balanceOf(this.state.user.address).call()
      console.log("Bilancio NFT prima del mint: ", beforeMint)
      let res = await contract.methods.mintToken(payload.from, payload.img, payload.metadata).send({from: this.state.user.address, gasPrice: '0', gasLimit: '1000000'})

      let afterMint = await contract.methods.balanceOf("0x0423cFBFdA5CDdab4F6777B6F1EEd92830F1e685").call()
      console.log("Bilancio NFT dopo del mint: ", afterMint)


      //let x = await contract.methods.name().call()
      //console.log("resulttest: ",resultTest)
    },

    async getAllevatoreByAddress({dispatch, commit}, pk){
        let account = this.state.web3.eth.accounts.privateKeyToAccount(pk)

        //0xE73FE4313709EbE78B7e7fe9B30b85B88Dd333C8 -> addres allevatore
        
        let res =  fetch("https://app.pinin-project.eu/andromeda-services/registry/contacts?address="+ "0xE73FE4313709EbE78B7e7fe9B30b85B88Dd333C8" + "&limit=10&offset=0&sort=id.asc", {
          mode: 'cors',
    
          headers: {
    
            Accept: '*/*',
    
            Authorization: "eahp " + this.state.token,
    
          }}).then((res) => {
              res = res.json().then((res) => {
              if (res[0]) {
                
                let payload =  {
                  userAccount: account,
                  userCF: res[0].name.split("-")[1]
                }

                commit("saveUser", payload)
                //console.log("LOGGATO")
                dispatch("getMuccheOf")
                
              } else {

                commit("loginFailed")
                //console.log("LOGIN FALLITO")
              }

            }).catch((e) => console.log(e))
          }).catch((e) => {
            console.log(e)
          });
    },
 
    async getMuccheOf({commit}){

      try{

        const bdnJSON = require("pinin-fondieuropei-json/json/StorageBDNGET_AEV2.json") 
    
        const contractAddress = "0x0d231e9431f67a1b32aa5275d83eb1405c6cec0f" 
    
        const contract = new this.state.web3.eth.Contract(bdnJSON.abi, contractAddress)
      
        var test = await contract.methods.getBovini(this.state.user.CF, 1, 0).call() //in lettura .call(), in scrittura .send()
        
        this.state.web3.currentProvider.engine.stop()

        commit("saveMucche", test)

      } catch(e) {
        console.log(e)
      }
    } 
  },

  modules: {
  }
})
