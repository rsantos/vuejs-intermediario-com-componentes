Vue.filter('ucwords', value => {
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.component('titulo', {
  template: `
  <div class="row">
    <h1>Campeonato Brasileiro - Série A - 2018</h1>
  </div>
  `
})

Vue.component('clube', {
  props: ['time', 'invertido'],
  template: `
  <div style="display: flex; flex-direction: row">
    <img :src="time.escudo" alt="" class="escudo" :style="{order: invertido == 'true' ? 2 : 1}">
    <span :style="{order: invertido == 'true' ? 1 : 2}">{{ time.nome | ucwords }}</span>
  </div>
  `
})

Vue.component('tabela-clubes', {
  props: ['times'],
  data() {
    return {
      busca: '',
      ordem: {
        colunas: ['pontos', 'gm', 'gs', 'saldo'],
        orientacao: ['desc', 'desc', 'asc', 'desc']
      }
    }
  },
  template: `
  <div>
    <input type="text" class="form-control" v-model="busca" placeholder="Filtrar time">
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Nome</th>
          <th v-for="(coluna, indice) in ordem.colunas">
            <a href="#" @click.prevent="ordenar(indice)">{{ coluna | ucwords}}</a>
          </th>
        </tr>
      </thead>
        <tbody>
            <tr v-for="(time, indice) in timesFiltrados" :class="{'table-success': indice < 6}">
                <td>
                    <clube :time="time"></clube>
                </td>
                <td>{{ time.pontos }}</td>
                <td>{{ time.gm }}</td>
                <td>{{ time.gs }}</td>
                <td>{{ time.saldo }}</td>
            </tr>
        </tbody>
    </table>
    <clubes-libertadores :times="timesOrdenados"></clubes-libertadores>
    <clubes-rebaixados :times="timesOrdenados"></clubes-rebaixados>
  </div>
  `,
  computed: {
    timesOrdenados() {
      return _.orderBy(this.times, this.ordem.colunas, this.ordem.orientacao)
    },
    timesFiltrados() {
      return _.filter(this.timesOrdenados, time => {
        let busca = this.busca.toLowerCase()
        return time.nome.toLowerCase().indexOf(busca) >= 0
      })
    }
  },
  methods: {
    ordenar(indice) {
      this.$set(this.ordem.orientacao, indice, this.ordem.orientacao[indice] == 'desc' ? 'asc' : 'desc')
    }
  }
})

Vue.component('clubes-libertadores', {
  props: ['times'],
  template: `
  <div>
    <h3>Time libertadores</h3>
    <ul>
        <li v-for="time in timesLibertadores">
            <clube :time="time"></clube>
        </li>
    </ul>
  </div>
  `,
  computed: {
    timesLibertadores() {
      return _.orderBy(this.times).slice(0, 6)
    }
  }
})

Vue.component('clubes-rebaixados', {
    props: ['times'],
    template: `
    <div>
      <h3>Time rebaixados</h3>
      <ul>
          <li v-for="time in timesRebaixados">
              <clube :time="time"></clube>
          </li>
      </ul>
    </div>
    `,
    computed: {
      timesRebaixados() {
        return _.orderBy(this.times).slice(16, 20)
      }
    }
})

Vue.component('novo-jogo', {
  props: ['timeCasa', 'timeFora'],
  data() {
    return {
      golsCasa: 0,
      golsFora: 0
    }
  },
  template: `
  <form class="form-inline">
      <input type="text" class="form-control col-md-1" v-model="golsCasa"/>
      <clube :time="timeCasa" invertido="true" v-if="timeCasa"></clube>
      <span>X</span>
      <clube :time="timeFora" v-if="timeFora"></clube>
      <input type="text" class="form-control col-md-1" v-model="golsFora"/>
      <button type="button" class="btn btn-primary" @click="fimJogo">Fim de jogo</button>
  </form>
  `,
  methods: {
    fimJogo() {
      let golsMarcados = parseInt(this.golsCasa)
      let golsSofridos = parseInt(this.golsFora)
      this.timeCasa.fimJogo(this.timeFora, golsMarcados, golsSofridos)
      this.visao = 'tabela'
    }
  }
})

new Vue({
  el: "#app",
  data: {
    gols: 3,
    times: [
      new Time('palmeiras', '/assets/palmeiras_60x60.png'),
      new Time('internacional', '/assets/internacional_60x60.png'),
      new Time('Flamengo', '/assets/flamengo_60x60.png'),
      new Time('Atlético-MG', '/assets/atletico_mg_60x60.png'),
      new Time('Santos', '/assets/santos_60x60.png'),
      new Time('Botafogo', '/assets/botafogo_60x60.png'),
      new Time('Atlético-PR', '/assets/atletico-pr_60x60.png'),
      new Time('Corinthians', '/assets/corinthians_60x60.png'),
      new Time('Grêmio', '/assets/gremio_60x60.png'),
      new Time('Fluminense', '/assets/fluminense_60x60.png'),
      new Time('Bahia', '/assets/bahia_60x60.png'),
      new Time('Chapecoense', '/assets/chapecoense_60x60.png'),
      new Time('São Paulo', '/assets/sao_paulo_60x60.png'),
      new Time('Cruzeiro', '/assets/cruzeiro_60x60.png'),
      new Time('Sport', '/assets/sport_60x60.png'),
      new Time('Ceará', '/assets/ceara_60x60.png'),
      new Time('Vitória', '/assets/vitoria_60x60.png'),
      new Time('Vasco', '/assets/vasco_60x60.png'),
      new Time('América-MG', '/assets/america_mg_60x60.png'),
      new Time('Paraná', '/assets/parana_60x60.png'),
    ],
    timeCasa: null,
    timeFora: null,
    visao: 'tabela'
  },
  methods: {
    criarNovoJogo() {
      let indiceCasa = Math.floor(Math.random() * 20),
        indiceFora = Math.floor(Math.random() * 20)

      this.timeCasa = this.times[indiceCasa]
      this.timeFora = this.times[indiceFora]
      this.visao = 'placar'
    }
  },
  filters: {
    saldo(time) {
      return time.gm - time.gs
    }
  }
})