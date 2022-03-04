import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import it from 'vuetify/lib/locale/it';

Vue.use(Vuetify);

export default new Vuetify({
    lang: {
      locales: { it },
      current: 'it',
    },
});
