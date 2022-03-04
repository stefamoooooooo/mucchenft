<template>
  <div>
    <h1>Cow list</h1>
    <v-card>
        FILTRI
    </v-card>
    <br/>
    <br/>
    <br/>
    <v-card elevation="2">
        <v-card v-for="cow in cows" :key="cow.id" color="green">
            id mucca: {{cow.id}} <br/>
            colore mucca: {{cow.color}} <br/>
            età: {{cow.age}} <br/>
            allevatore: {{cow.breeder}} <br/>
            <button type="button" class="btn btn-primary mx-2"> Compra {{cow.price}} </button>
            <br/><br/>
        </v-card>
    </v-card>
  </div>
</template>


<script>
export default {
    name: "CowList",
    data: function() {
        return {
            cows: []
        }
    },
    mounted() {
        //getCows()
        this.cows = [
            {
                id: 1,
                color: "black",
                age: 10,
                price: 100,
                breeder: "Gianni"
            },
            {
                id: 2,
                color: "white",
                age: 7,
                price: 200,
                breeder: "Gianni"
            },
            {
                id: 3,
                color: "brown",
                age: 5,
                price: 300,
                breeder: "Gianni"
            }
        ]
    },
    methods: {
        buy(){
            console.log("ciao")
        }
    }
}
</script>