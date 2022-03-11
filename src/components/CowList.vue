<template>
  <v-container>
    <h1>Compra NFT</h1><br>
    <!--
    <v-col>
        <v-card>
            <v-card-title></v-card-title>
        </v-card>
    </v-col>
    
    <br/>
    <br/>
    <br/>
    <v-card elevation="2">
        <v-card v-for="cow in cows" :key="cow.id">
            id mucca: {{cow.id}} <br/>
            colore mucca: {{cow.color}} <br/>
            età: {{cow.age}} <br/>
            allevatore: {{cow.breeder}} <br/>
            <button type="button" class="btn btn-primary mx-2"> Compra {{cow.price}} </button>
            <br/><br/>
        </v-card>
    </v-card> -->
    <v-expansion-panels>
        <v-expansion-panel
            v-for="(breeder, index) in this.$store.state.datiAllevatori"
            :key="index"
        >
            <v-expansion-panel-header>
                
                {{ breeder.nome }}
                
            </v-expansion-panel-header>

            <v-expansion-panel-content>
                <v-container >
                
                    <v-card
                        v-for="(mucca, ind) in $store.state.datiAllevatori[index].nft" 
                        :key="ind"
                        width="300"
                        hover
                        class="ma-4"
                    >
                        <v-card-title>
                            {{ mucca }}
                        </v-card-title>
                        <v-card-actions>
                            <v-btn>
                                Compra!
                            </v-btn>
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

export default {
    name: "CowList",
    data: function() {
        return {
            cows: []
        }
    },

    mounted(){
        this.getMucche()
    },

    methods: {
        ...mapActions(["getMucche"]),

        buy(){
            console.log("ciao")
        }
    }
}
</script>