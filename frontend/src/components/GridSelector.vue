<template>
  
  <div class="main">
    <div class="panel">
      <div id='number' class="your-number"></div>
      
    </div>
    <button class="commit-btn" @click="onCommit">Commit</button>
    <div class="grid-container">  
      <div class="grid-panel">
        <div class="grid-item" @click="onClick" @dblclick="dblClick">1</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">2</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">3</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">4</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">5</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">6</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">7</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">8</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">9</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">10</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">11</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">12</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">13</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">14</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">15</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">16</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">17</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">18</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">19</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">20</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">21</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">22</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">23</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">24</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">25</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">26</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">27</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">28</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">29</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">30</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">31</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">32</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">33</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">34</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">35</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">36</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">37</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">38</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">39</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">40</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">41</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">42</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">43</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">44</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">45</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">46</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">47</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">48</div>
        <div class="grid-item" @click="onClick" @dblclick="dblClick">49</div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      player: {
          "address": "kjklfsjsflkflknflk",
          "number": "7893022",
          "country": "Spain",
          "twitter": "@lklss"
      }
    };
  },
  methods: {

    onClick(e) {
      e.target.classList.toggle('selected');
      const elements = document.querySelectorAll('.grid-item');
      let num = '';
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 49; j+=7) {
          if ( elements[i+j].classList.contains('selected') ) {
            num += elements[i+j].innerHTML;
          }
        }
      }
      document.getElementById('number').innerHTML = num;
      this.player.number = num;
    },

    dblClick() { 
      const elements = document.querySelectorAll('.selected');
      elements.forEach( (e) => e.classList.remove('selected') );
      document.getElementById('number').innerHTML = '';
    },

    async onCommit() {
      const res = await fetch('http://localhost:5000/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({player: this.player})
      });
      const data = await res.json();
      console.log(data);

    }

  }

}
</script>
  

<style>

.main {

  height: 800px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  align-content: center;
}

.grid-container {
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
}
.grid-panel {
  z-index: 1;
  display: grid;
  gap: 5px;
  grid-template-columns: 60px 60px 60px 60px 60px 60px 60px;
  grid-template-rows: 60px 60px 60px 60px 60px 60px 60px;
  border-radius: 5px;
  border: 1px solid white;
  padding: 5px;
  background-color: #222;
}

.grid-item {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 5px;
  color: white;
  font-size: 14px;
}

.grid-item:hover {
  background-color: #fff;
  color: #333;
  cursor: pointer;
}

.selected {
  background-color: rgb(73, 240, 95);
  color: #333;
  border: 3px solid rgb(73, 240, 95);
}

.selected:hover {
  background-color: rgba(73, 240, 95, 0.644);
  color: #333;
}

.panel {
  display: flex;
  height: 80px;
  align-items: center;
  align-content: center;
  justify-content: center;
}

.your-number {
  color:rgb(73, 240, 95);
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
}

.commit-btn {
  margin-bottom: 40px;
  background-color: transparent;
  border: 1px solid #999;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
}
<!-- 
button {
  background-color: transparent;
  border: 1px solid #999;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  margin: 0 10px;
  padding: 6px 15px;
}

button:hover {
  background-color: #fff;
  border-color: #fff;
  color: #333;
} -->

</style>