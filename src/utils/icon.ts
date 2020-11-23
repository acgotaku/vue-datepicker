import Vue from 'vue';
import Icon from '@/components/Icon.vue';

// register globally
Vue.component('svg-icon', Icon);

const req = require.context('@/assets/icons', false, /\.svg$/i);
const requireAll = (requireContext: any) =>
  requireContext.keys().map(requireContext);
requireAll(req);
