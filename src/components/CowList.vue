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
                <v-btn> Compra! </v-btn>
              </v-card-actions>
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

export default {
  components: { VueMetamask },
  name: "CowList",
  data: function () {
    return {
      cows: [],
      msg: "This is demo net work",
      mmSupport: false,
    };
  },

  mounted() {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!");
      this.mmSupport = true;
    }
  },

  methods: {
    ...mapActions(["getMucche", "initWeb3Pub"]),

    onComplete(data) {
      console.log("data:", data);
      this.initWeb3Pub(data.web3);

      this.getMucche();
    },

    buy() {
      console.log("ciao");
    },
  },
};
</script>
