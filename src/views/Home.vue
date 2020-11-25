<template>
  <div class="home">
    <DatePicker v-model="dateRange" class="date top" />
    <DatePicker v-model="dateRange" class="date bottom" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DatePicker from '@/components/datePicker'; // @ is an alias to /src

@Component({
  components: {
    DatePicker
  }
})
export default class Home extends Vue {
  dateRange = [];
}
</script>
<style lang="scss">
.home {
  height: 100vh;
  position: relative;
}
.date {
  position: absolute;
  width: 304px;

  &.top {
    top: 16px;
    left: 16px;
  }

  &.bottom {
    bottom: 16px;
    left: 16px;
  }
}
</style>
