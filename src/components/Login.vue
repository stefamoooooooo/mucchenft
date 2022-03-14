<template>
  <!--  Inserire la chiave -> bottone login  -->
  <v-container>
    <br />
    <v-card v-if="this.$store.state.user.logged === false">
      <v-card-title class="mx-2 mt-5">
        Necessario ruolo da allevatore per proseguire
      </v-card-title>
      <v-card-actions>
        <v-text-field v-model="pk" placeholder="chiave" class="mx-2 mt-5" />
        <v-btn type="button" class="btn btn-primary mx-2" v-on:click="doLogin">
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-if="this.$store.state.user.logged === true">
      <v-card-title>
        Loggato come: {{ this.$store.state.user.address }}
      </v-card-title>
      <v-card-title> CF: {{ this.$store.state.user.CF }} </v-card-title>
      <v-card-subtitle> Inserisci i parametri della mucca: </v-card-subtitle>
      <v-card-actions>
        <v-combobox
          :items="this.$store.state.cowsList"
          class="mx-2"
          v-model="cow.id"
          placeholder="marca auricolare"
        />
        <v-text-field
          type="text"
          class="mx-2"
          v-model="cow.color"
          placeholder="colore mucca"
        />
        <v-text-field
          type="number"
          class="mx-2"
          v-model="cow.age"
          placeholder="età mucca"
        />
        <v-text-field
          type="text"
          class="mx-2"
          v-model="cow.razza"
          placeholder="razza mucca"
        />
        <v-btn
          type="button"
          class="btn btn-primary mx-2"
          v-on:click="mint(cow.id)"
        >
          Mint
        </v-btn>
      </v-card-actions>
    </v-card>

    <br />
    <br />
    <br />
    <br />

    <v-card v-if="this.$store.state.user.logged === true">
      <h3>Elenco mucche dell'allevatore:</h3>
      <div>
        <div v-if="!this.$store.state.cowList"></div>
        <v-card v-for="(cow, index) in this.$store.state.cowsList" :key="index">
          <v-card-title> id mucca: {{ cow }} </v-card-title>

          <br />
        </v-card>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
const pinataSDK = require("@pinata/sdk");
const pinata = pinataSDK(
  "076cca4f7dda4eed3a76",
  "72df3249903924129b0b0890b1a177b8ebd3d2e0e66579820d8baa6285d5d6c2"
);

export default {
  name: "Login",
  data: function () {
    return {
      pk: "",
      cow: {
        id: "",
        color: "",
        age: "",
        razza: "",
      },
    };
  },

  mounted() {
    if (this.$store.state.web3 === null) {
      this.initWeb3(this.pk);
      //this.initWeb3Pub()
    }
  },

  methods: {
    ...mapActions([
      "initWeb3",
      "initWeb3Pub",
      "getAllevatoreByAddress",
      "mintTx",
    ]),

    doLogin() {
      this.getAllevatoreByAddress(this.pk);
    },

    async mint(id) {
      if (this.$store.state.cowsList.indexOf(id) !== -1) {
        // controllo che non ci sia gia un payload con quel nome
        const metadataFilter = {
          name: id,
          keyvalues: {},
        };

        const filters = {
          status: "pinned",
          pageLimit: 10,
          pageOffset: 0,
          metadata: metadataFilter,
        };

        let res = await pinata.pinList(filters);
        console.log("res: ", res.rows);

        if (res.count == 0) {
          let ipfshash = await this.uploadMetadata();

          let payload = {
            from: this.$store.state.user.address,
            //img: "QmTuhgzis4Ge8ZymQDkYhSvK5CwyeYSw851vUc5xn7QEPo",
            metadata: ipfshash.IpfsHash,
          };

          this.mintTx(payload);
        } else {
          console.log(
            "La marca auricolare indicata, risulta già essere stata mintata"
          );
        }
      } else console.log("L'id inserito non appartiene all'allevatore");
    },

    async getPhontoHash() {
      const metadataFilter = {
        name: "Muccaa",
        keyvalues: {},
      };

      const filters = {
        status: "pinned",
        pageLimit: 10,
        pageOffset: 0,
        metadata: metadataFilter,
      };
      let res = await pinata.pinList(filters);
      res = res.rows[0].ipfs_pin_hash;
      return res;
    },

    async uploadMetadata() {
      const marca = this.cow.id;
      const colore = this.cow.color;
      const eta = this.cow.age;
      const razza = this.cow.razza;
      const image = await this.getPhontoHash();

      const body = {
        "marca auricolare": marca,
        image: image,
        colore: colore,
        eta: eta,
        razza: razza,
      };

      console.log(body);

      const options = {
        pinataMetadata: {
          name: marca,
          keyvalues: {
            breeder: this.$store.state.user.CF,
          },
        },
      };

      return await pinata.pinJSONToIPFS(body, options);
    },
  },
};
</script>
