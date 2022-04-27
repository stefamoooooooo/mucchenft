<template>
  <v-container>
    <vue-metamask userMessage="msg" @onComplete="onComplete"></vue-metamask>
    <h1>Compra NFT</h1>
    <br />

    <v-expansion-panels v-if="this.mmSupport">
      <v-expansion-panel
        v-for="(breeder, index) in this.$store.state.datiAllevatori"
        :key="index"
      >
        <v-expansion-panel-header>
          {{ breeder.nome }}
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <v-container>
            <v-card
              v-for="(mucca, ind) in $store.state.datiAllevatori[index].nft"
              :key="ind"
              width="500"
              hover
              class="ma-4"
            >
              <v-img
                src="https://gateway.pinata.cloud/ipfs/QmTuhgzis4Ge8ZymQDkYhSvK5CwyeYSw851vUc5xn7QEPo"
              />
              <v-card-title>
                {{ mucca["marca auricolare"] }} <br />
              </v-card-title>

              <v-card-text>
                colore: {{ mucca["colore"] }} <br />
                eta': {{ mucca["eta"] }} <br />
                razza: {{ mucca["razza"] }}
              </v-card-text>

              <v-card-actions>
                <v-btn
                  v-on:click="buy(mucca)"
                  :disabled="mucca.price == 0"
                  :loading="loadingBuy"
                >
                  Compra per {{ mucca.price }} ETH!
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <br />
    <br />

    <v-expansion-panels v-if="this.$store.state.user.NFTs.length !== 0">
      <v-expansion-panel>
        <v-expansion-panel-header>
          Tuoi NFT ({{ this.$store.state.user.address }})
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container>
            <v-card
              v-for="(mucca, ind) in $store.state.user.NFTs"
              :key="ind"
              width="500"
              hover
              class="ma-4"
            >
              <v-img
                src="https://gateway.pinata.cloud/ipfs/QmTuhgzis4Ge8ZymQDkYhSvK5CwyeYSw851vUc5xn7QEPo"
              />
              <v-card-title>
                {{ mucca["marca auricolare"] }} <br />
              </v-card-title>

              <v-card-text>
                colore: {{ mucca["colore"] }} <br />
                eta': {{ mucca["eta"] }} <br />
                razza: {{ mucca["razza"] }}
              </v-card-text>
              <v-row>
                <v-col
                  ><v-btn v-on:click="generateQRCode(mucca)"
                    >Genera QRCode</v-btn
                  ></v-col
                >
                <v-col>
                  <span v-if="showQR & (mucca.id == cow.id)">
                    <qrcode-vue :value="value"></qrcode-vue>
                  </span>
                </v-col>
              </v-row>
            </v-card>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import VueMetamask from "vue-metamask";
import QrcodeVue from "qrcode.vue";

export default {
  components: { VueMetamask, QrcodeVue },
  name: "CowList",
  data: function () {
    return {
      cow: { id: 0 },
      msg: "This is demo net work",
      mmSupport: false,
      loadingBuy: false,
      value: "",
      showQR: false,
    };
  },

  mounted() {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!");
      this.mmSupport = true;
    }
  },

  methods: {
    ...mapActions([
      "getMuccheNFT",
      "initWeb3PubMetaMask",
      "loginUser",
      "buyNFT",
      "checkOwnership",
    ]),

    onComplete(data) {
      console.log("data:", data);
      this.initWeb3PubMetaMask(data.web3);
      if (!this.$store.state.user.logged) {
        this.loginUser(data.metaMaskAddress);
      }

      this.getMuccheNFT();
    },

    async buy(mucca) {
      this.loadingBuy = true;
      //console.log(mucca)
      let payload = {
        idNFT: mucca.id,
        owner: mucca.owner,
        price: mucca.price,
      };
      await this.buyNFT(payload);
      this.loadingBuy = false;
    },

    async generateQRCode(mucca) {
      this.cow = mucca;
      this.value = this.$store.state.user.address + "|" + mucca.id;

      var hash = this.$store.state.web3pub.utils.sha3(this.value);
      var accounts = await this.$store.state.web3pub.eth.getAccounts();
      var signature = await this.$store.state.web3pub.eth.personal.sign(
        this.value,
        accounts[0]
      );

      this.value =
        this.$store.state.user.address + "|" + mucca.id + "|" + signature;

      this.showQR = true;

      console.log("Contenuto del QRCode:  ", this.value);
    },
  },
};
</script>
