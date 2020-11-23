<template>
  <div class="home">
    <DatePicker v-model="dateRange" class="date" />
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
.date {
  width: 304px;
}
</style>
