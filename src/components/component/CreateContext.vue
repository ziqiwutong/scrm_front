<template>
  <!--创建素材-->
  <div>
    <button @click="createContext">+创建素材</button>
  </div>
</template>

<script>
export default {
  name: "CreateContext",
  methods:{
    createContext(){
      this.$emit('ifShow',true);
    }
  }
}
</script>

<style scoped>
button{
  position: fixed;
  bottom: 80px;
  right: 0;
  left: 0;
  margin: auto;
  border: none;
  width: 80px;
  line-height: 30px;
  font-size: 13px;
  background-color: black;
  color: white;
  border-radius: 2px;
}
</style>
