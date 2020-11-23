<template>
  <div
    class="input"
    :class="{ 'o-disabled': disabledState }"
    @mouseenter="inputHover = true"
    @mouseleave="inputHover = false"
  >
    <div class="input-prefix">
      <slot name="prefix"></slot>
    </div>
    <textarea
      v-if="istextArea"
      ref="input"
      class="input-inner"
      :rows="rows"
      :class="{ 'o-hover': inputHover, 'o-error': inValidState }"
      :readonly="readonly"
      v-model="currentValue"
      @input="emitInput"
      @blur="emitBlur"
      @keyup.esc="emitEsc"
      @keyup.enter="emitEnter"
      :disabled="disabledState"
      :placeholder="placeholder"
      :required="required"
    ></textarea>
    <input
      v-else
      ref="input"
      class="input-inner"
      :type="type"
      :autocomplete="autocomplete"
      :class="{ 'o-hover': inputHover, 'o-error': inValidState }"
      :readonly="readonly"
      v-model="currentValue"
      @input="emitInput"
      @blur="emitBlur"
      @keyup.esc="emitEsc"
      @keyup.enter="emitEnter"
      :disabled="disabledState"
      :placeholder="placeholder"
      :required="required"
    />

    <div class="input-suffix">
      <slot name="suffix"></slot>
      <svg-icon
        name="reset"
        class="clear-icon"
        @click.native.stop="clearInput"
        v-if="showClearButton"
      />
      <svg-icon name="waiting" class="loading-icon" v-if="loading" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class Input extends Vue {
  @Prop({ default: '' }) readonly value!: string;
  @Prop({ default: 'text', type: String }) readonly type!: string;
  @Prop({ default: 'no', type: String }) readonly autocomplete!: string;
  @Prop({ default: 2, type: Number }) readonly rows!: number;
  @Prop({ default: false, type: Boolean }) readonly readonly!: boolean;
  @Prop({ default: false, type: Boolean }) readonly disabled!: boolean;
  @Prop({ default: false, type: Boolean }) readonly required!: boolean;
  @Prop({ default: false, type: Boolean }) readonly loading!: boolean;
  @Prop({ default: false, type: Boolean }) readonly clearable!: boolean;
  @Prop({ default: false, type: Boolean }) readonly invalid!: boolean;
  @Prop({ default: false }) readonly placeholder!: string;

  currentValue = this.value;
  inputHover = false;

  @Watch('value')
  onValueChanged() {
    this.currentValue = this.value;
    this.$emit('on-change', this.currentValue);
  }

  get showClearButton() {
    return this.clearable && !this.disabled && !!this.currentValue;
  }

  get inValidState() {
    return this.invalid;
  }

  get disabledState() {
    return this.disabled;
  }

  get istextArea() {
    return this.type === 'textarea';
  }

  clearInput() {
    this.currentValue = '';
    this.emitClear();
    this.$nextTick(() => {
      this.focus();
    });
  }

  focus() {
    (this.$refs['input'] as HTMLInputElement).focus();
  }

  emitClear() {
    this.emitInput();
    this.$emit('on-clear', this.currentValue);
  }

  emitInput() {
    this.$emit('input', this.currentValue);
    this.$emit('on-input', this.currentValue);
  }

  emitEsc() {
    this.$emit('on-esc');
  }
  emitEnter() {
    this.$emit('on-enter');
  }
  emitBlur() {
    this.$emit('on-blur');
  }
}
</script>
<style lang="scss">
.input {
  position: relative;
  height: 100%;
  display: flex;
  align-items: stretch;

  .svg-icon {
    position: absolute;
    width: 1rem;
    height: 1rem;
    color: var(--black-tertiary);
    background-color: var(--white);
  }

  &.o-disabled {
    .svg-icon {
      background-color: transparent;
    }
  }

  .clear-icon {
    cursor: pointer;
    visibility: hidden;
  }

  .loading-icon {
    top: 0;
    left: 0;
  }

  &:hover {
    .clear-icon {
      visibility: visible;
    }
  }

  &-prefix,
  &-suffix {
    position: absolute;
    width: 1rem;
    height: 1rem;
    top: 50%;
    transform: translateY(-50%);

    &:empty {
      visibility: hidden;
    }
  }

  &-prefix {
    left: 0.5rem;
  }

  &-suffix {
    right: 0.5rem;
  }

  &-inner {
    width: 100%;
    border-radius: 0.25rem;
    color: var(--black-main);
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding: 5px 8px;
    line-height: 1.25rem;
    border: 1px solid var(--black-border);

    &:read-only {
      user-select: none;
      cursor: pointer;
    }

    &:hover,
    &.o-hover,
    &:focus {
      border: 1px solid var(--primary);
      outline: none;
    }

    &.o-error {
      border: 1px solid var(--danger);
    }

    &:disabled {
      cursor: not-allowed;
      color: var(--black-disabled);
      background-color: var(--black-light-bg);

      &:hover,
      &.o-hover,
      &:focus {
        border: 1px solid var(--black-border);
      }
    }
  }
}
</style>
