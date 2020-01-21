// IntelliJにおいて.vueファイルがcannot find module になる対応
// https://qiita.com/ryo511/items/0408d3763af797a16a7a
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
