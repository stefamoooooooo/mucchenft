<template>
  <!--  Inserire la chiave -> bottone login  -->
  <v-container>
    <br />
    <v-container v-if="this.$store.state.user.logged === false">
      <h2 class="mx-2 mt-5">Necessario ruolo da allevatore per proseguire</h2>

      <v-row>
        <v-col>
          <v-form>
            <v-text-field
              v-model="pk"
              placeholder="inserisci chiave privata"
              class="mx-2 mt-5"
            />

            <v-btn
              type="button"
              class="btn btn-primary mx-2"
              v-on:click="doLogin"
            >
              Login
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>

    <!--
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

     -->

    <v-container
      v-if="
        this.$store.state.user.logged === true &&
        this.$store.state.user.role == 'allevatore'
      "
    >
      <!-- CARD INFO UTENTE LOGGATO -->
      <v-card color="#f5f5f5">
        <v-card-title>
          <v-col>
            Utente loggato <br />
            Address: {{ this.$store.state.user.address }} <br />
            CF: {{ this.$store.state.user.CF }}
          </v-col>
        </v-card-title>
      </v-card>

      <br /><br /><br />

      <!-- CARD MINTING NFT -->
      <v-card color="#f5f5f5">
        <v-card-title
          ><v-col
            >Inserisci i parametri della mucca da mintare:</v-col
          ></v-card-title
        >

        <v-card-actions>
          <v-col>
            <v-form>
              <v-combobox
                :items="this.$store.state.cowsList"
                class="mx-2"
                v-model="cow.id"
                placeholder="marca auricolare"
              />
              <v-text-field
                type="text"
                class="mx-2"
                v-model="cow.nome"
                placeholder="nome"
              />
              <v-combobox
                :items="colors"
                class="mx-2"
                v-model="cow.color"
                placeholder="colore"
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
              <v-text-field
                type="number"
                class="mx-2"
                v-model="cow.price"
                placeholder="prezzo in ETH"
              />
              <v-btn
                type="button"
                class="btn btn-primary mx-2"
                v-on:click="mint(cow.id)"
                :loading="loadingMint"
              >
                Mint
              </v-btn>
            </v-form>
          </v-col>
        </v-card-actions>
      </v-card>

      <br /><br /><br />

      <v-card color="#f5f5f5">
        <v-card-title> <v-col>Imposta i prezzi</v-col> </v-card-title>
        <v-card-actions>
          <v-container>
            <v-col>
              <v-card
                color="#b3b3b3"
                v-for="(cow, index) in this.$store.state.user.NFTs"
                :key="index"
                width="500"
                hover
                class="ma-4"
              >
                <v-img
                  v-bind:src="`https://gateway.pinata.cloud/ipfs/${cow.image}`"
                />
                <v-card-title v-if="cow.nome">
                  {{ cow["nome"] }}
                </v-card-title>
                <v-card-title v-else>
                  {{ cow["marca auricolare"] }}
                </v-card-title>
                <v-card-actions>
                  <v-card-text>
                    <p>colore: {{ cow["colore"] }}</p>
                    <p>eta': {{ cow["eta"] }}</p>
                    <p>razza: {{ cow["razza"] }}</p>
                    <p>
                      prezzo:
                      <span v-if="cow.price == 0">
                        <v-text-field
                          type="number"
                          class="mx-2"
                          v-model="priceToSet"
                          placeholder="Inserisci un prezzo in ETH"
                        />
                        <v-btn
                          v-on:click="setPrice(priceToSet, cow.id)"
                          :loading="loadingSetPrice"
                        >
                          ok
                        </v-btn>
                      </span>
                      <span v-else>
                        {{ cow.price }} ETH
                        <v-btn x-small v-on:click="modificaPrezzo(cow)">
                          Modifica
                        </v-btn>
                      </span>
                    </p>
                  </v-card-text>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-container>

    <br />
    <br />
    <br />
    <br />

    <!--<v-card v-if="this.$store.state.user.logged === true">
      <h3>Elenco mucche dell'allevatore:</h3>
      <div>
        <div v-if="!this.$store.state.cowList"></div>
        <v-card v-for="(cow, index) in this.$store.state.cowsList" :key="index">
          <v-card-title> id mucca: {{ cow }} </v-card-title>

          <br />
        </v-card>
      </div>
    </v-card>-->
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

const pinataSDK = require("@pinata/sdk");
const pinata = pinataSDK(
  "3ec5f37ccb7e55ef9b0f",
  "9d5f0260bc37ea5eee09dea4f1abbd7080cf16395e02d1ab3fbf848e42867a98"
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
        price: 0,
        nome: "",
      },
      colors: ["marrone", "nero", "bianco-marrone", "bianco-nero"],
      priceToSet: "",
      loadingMint: false,
      loadingSetPrice: false,
    };
  },

  mounted() {
    //console.log("sono in mounted");
    if (
      this.$store.state.user.logged &&
      this.$store.state.user.role == "allevatore"
    ) {
      //console.log("sono in mounted ed e loggato ed allevatore");
      this.getMuccheOf(this.$store.state.user.CF);
      this.getNFTOf(this.$store.state.user.address);
    }
  },

  methods: {
    ...mapActions([
      "initWeb3",
      "initWeb3Pub",
      "getAllevatoreByAddress",
      "getMuccheOf",
      "mintTx",
      "getNFTOf",
      "setPriceNFT",
    ]),

    getUrl(cow) {
      return "https://gateway.pinata.cloud/ipfs/" + cow.image;
    },

    modificaPrezzo(cow) {
      cow.price = 0;
    },

    doLogin() {
      try {
        if (this.$store.state.web3 === null) {
          this.initWeb3(this.pk); // pinin
          this.initWeb3Pub(); // regionale
        }
        this.getAllevatoreByAddress(this.pk);
      } catch (err) {
        alert(err);
      }
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

        this.loadingMint = true;

        let res = await pinata.pinList(filters);
        console.log("res: ", res.rows);

        if (res.count == 0) {
          let ipfshash = await this.uploadMetadata();

          let payload = {
            from: this.$store.state.user.address,
            metadata: ipfshash.IpfsHash,
            price: this.cow.price,
          };

          await this.mintTx(payload);
          //this.getNFTOf(this.$store.state.user.address);
        } else {
          console.log(
            "La marca auricolare indicata, risulta già essere stata mintata"
          );
        }

        this.loadingMint = false;
      } else console.log("L'id inserito non appartiene all'allevatore");
    },

    async getPhontoHash() {
      //console.log(this.cow, "MUCCA getphotohash");
      const metadataFilter = {
        name: this.cow.color,
        keyvalues: {},
      };
      console.log("METADATI -> ", metadataFilter);

      const filters = {
        status: "pinned",
        pageLimit: 10,
        pageOffset: 0,
        metadata: metadataFilter,
      };
      let res = await pinata.pinList(filters);
      let finalRes;
      //console.log("pinata res: ", res);
      res.rows.forEach((element) => {
        if (element.metadata.name == this.cow.color + ".png")
          finalRes = element.ipfs_pin_hash;
      });
      //res = res.rows[0].ipfs_pin_hash;
      return finalRes;
    },

    async uploadMetadata() {
      const marca = this.cow.id;
      const nome = this.cow.nome;
      const colore = this.cow.color;
      const eta = this.cow.age;
      const razza = this.cow.razza;
      const image = await this.getPhontoHash();

      const body = {
        "marca auricolare": marca,
        nome: nome,
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

    async setPrice(price, id) {
      let payload = {
        id: id,
        price: price,
      };
      this.loadingSetPrice = true;
      await this.setPriceNFT(payload);
      for (let i = 0; i < this.$store.state.user.NFTs.length; i++) {
        if (this.$store.state.user.NFTs[i].id == id) {
          this.$store.state.user.NFTs[i].price = price;
        }
      }
      this.loadingSetPrice = false;
    },
  },
};
</script>
