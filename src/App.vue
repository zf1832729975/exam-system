<template>
  <div id="app">
     <router-view></router-view>
  </div>
</template>

<script>
// import HelloWorld from './views/hello-world.vue'

export default {
  name: 'app',
  components: {
    // HelloWorld
  }
}
</script>

<style>
*{
  box-sizing: border-box;
}

body{
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust:100%;
  color: #333;
  font-size: 14px;
  background: #fff;
}

body,ol,ul,h1,h2,h3,h4,h5,h6,p,th,td,form,fieldset,legend,input,textarea,select{margin:0;padding:0}
a{color:#2d374b;text-decoration:none}
a:hover{color:#cd0200;text-decoration:underline}
em{font-style:normal}
li{list-style:none}
img{border:0;vertical-align:middle}
table{border-collapse:collapse;border-spacing:0}
p{word-wrap:break-word}
.pull-left {
	float: left;
}
/*清除浮动*/
.clearfix::before,
.clearfix::after {
	content: "";
	display: block;
	height: 0;
	line-height: 0;
	visibility: hidden;
	clear: both;
}

.pull-right {
	float: right;
}
.inline > div {
    display: inline-block;
}
</style>
