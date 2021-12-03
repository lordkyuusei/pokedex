<script>
    import { getContext } from "svelte";
    const { setTheme } = getContext('theme');
</script>

<label class="switch">
    <input type="checkbox">
    <span class="slider round" on:click={setTheme}></span>
</label>

<style scoped>
.switch {
margin: 10px;
  position: relative;
  display: inline-block;
  width: 60px;
  height: 15px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  -webkit-transition: .3s;
  transition: .3s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 32px;
    width: 32px;
    left: 15px;
    bottom: -5px;
    background: url("/moon.png") no-repeat center center;
    background-size: cover;
    -webkit-transition: .3s;
    transition: .3s;
}

input:checked + .slider {
  background-color: var(--theme-text)
}

input:focus + .slider {
    background-color: var(--theme-text)
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
  background: url("/sun.png") no-repeat center center;
  background-size: cover;
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}
</style>