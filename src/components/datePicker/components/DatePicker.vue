<template>
  <div class="date-picker" v-click-outside="clickClose">
    <div
      class="date-picker-rel"
      ref="reference"
      @click="handleClick"
      :class="{ 'o-disabled': disabled }"
    >
      <slot name="picker">
        <VueInput
          v-model="currentDate"
          class="date-picker-input"
          :disabled="disabled"
          :placeholder="placeholder"
          :clearable="clearable"
          @on-clear="clearDate"
          @on-input="input"
          @on-blur="updateDate"
        >
          <template v-slot:suffix>
            <svg-icon
              name="date"
              class="date-picker-icon"
              :class="{ 'o-disabled': disabled, 'o-show': visible }"
            />
          </template>
        </VueInput>
      </slot>
    </div>
    <transition name="fade">
      <div
        class="date-picker-popper"
        :style="styles"
        ref="popper"
        v-show="visible && !disabled"
      >
        <DateTable
          :selectedDate="formatedDate"
          :isRange="isRange"
          :visible="visible"
          @select="selectDate"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
// @ts-ignore
import { directive as clickOutside } from 'v-click-outside-x';
import Input from '@/components/input';
import PopperMixin from '@/mixins/popper';
import DateTable from './DateTable.vue';
import dateUtils from '@/utils/date';

@Component({
  directives: {
    clickOutside
  },
  components: {
    DateTable,
    VueInput: Input
  },
  provide() {
    return {
      picker: this
    };
  }
})
export default class DatePicker extends Mixins(PopperMixin) {
  @Prop() readonly value!: Date | null | Array<Date | null>;
  @Prop({ default: false }) readonly disabled!: boolean;
  @Prop({ default: false, type: Boolean }) readonly clearable!: boolean;
  @Prop({ default: '' }) readonly placeholder!: string;

  currentDate = '';

  updateByInput = false;

  @Watch('value', { immediate: true })
  onValueChanged() {
    this.currentDate = dateUtils.formatDate(this.value);
  }

  clickClose() {
    if (this.visible && !this.disabled) {
      this.closePopper();
    }
  }

  handleClick() {
    if (!this.disabled) {
      if (this.visible) {
        this.closePopper();
      } else {
        this.showPopper();
      }
    }
  }

  get formatedDate(): Array<Date | null> {
    if (Array.isArray(this.value)) {
      return this.value;
    } else {
      return [this.value];
    }
  }

  get isRange() {
    return Array.isArray(this.value);
  }

  clearDate() {
    if (this.isRange) {
      this.$emit('input', [null, null]);
    } else {
      this.$emit('input', null);
    }
  }

  input() {
    this.updateByInput = true;
  }

  updateDate() {
    if (this.updateByInput) {
      if (this.isRange) {
        const dates = this.currentDate.split(' - ');
        if (dates.length > 1) {
          const [start, end] = dates;
          const startDate = dateUtils.parseDate(start);
          const endDate = dateUtils.parseDate(end);
          if (
            !Number.isNaN(startDate.getTime()) &&
            !Number.isNaN(endDate.getTime())
          ) {
            this.$emit(
              'input',
              [startDate, endDate].sort((s, e) => {
                return s.getTime() - e.getTime();
              })
            );
          } else {
            this.$emit('input', this.value);
            this.currentDate = dateUtils.formatDate(this.value);
          }
        }
      } else {
        const startDate = new Date(this.currentDate);
        if (!Number.isNaN(startDate.getTime())) {
          this.$emit('input', startDate);
        } else {
          this.$emit('input', this.value);
          this.currentDate = dateUtils.formatDate(this.value);
        }
      }
      this.updateByInput = false;
    }
  }

  selectDate(date: Date | Array<Date>) {
    this.currentDate = dateUtils.formatDate(date);
    this.$emit('input', date);
    this.clickClose();
  }
}
</script>
<style lang="scss">
.date-picker {
  display: block;

  &-popper {
    width: 272px;
  }
}
</style>
