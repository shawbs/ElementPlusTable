import CommonTable from "./table.vue";
import CommonForm from "./form.vue";
import auth from "./directives/auth";

export { CommonTable, CommonForm };

export default {
  install(Vue) {
    Vue.directive("auth", auth);
    Vue.component("CommonTable", CommonTable);
    Vue.component("CommonForm", CommonForm);
  },
};
