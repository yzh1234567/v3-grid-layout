import GridItem from './GridItem.vue';
import GridLayout from './GridLayout.vue';
// import ResponsiveGridLayout from './ResponsiveGridLayout.vue';

const VueGridLayout = [
  GridLayout,
  GridItem,
  // ResponsiveGridLayout,
]

function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  VueGridLayout.forEach(component => {
    Vue.component(component.name, component);
  });
}


export default {
  GridLayout, 
  GridItem,
  install
};
export { GridLayout, GridItem};
