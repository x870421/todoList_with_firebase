const app = Vue.createApp({
  data() {
    return {
      tododata: {},
      firebase: {},
      temp: '',
      state: 'all',
      renderData: {},
      todoNum: 0,
      wait: false,
    };
  },

  methods: {
    switchState(n = 'all') {
      this.state = n;
      if (this.state === 'all') {
        this.renderData = this.tododata;
      } else if (this.state === 'todo') {
        let obTemp = {};
        for (let item in this.tododata) {
          if (this.tododata[item].checked === false) {
            obTemp[item] = this.tododata[item];
          }
          this.renderData = obTemp;
        }
      } else if (this.state === 'finish') {
        let obTemp = {};
        for (let item in this.tododata) {
          if (this.tododata[item].checked === true) {
            obTemp[item] = this.tododata[item];
          }
          this.renderData = obTemp;
        }
      }
    },
    addTodo() {
      if (this.temp === '' || this.wait == true) {
        alert('請輸入代辦事項');
        return;
      }
      this.firebase.push({ content: this.temp, checked: false });
      this.reloadData();
      this.temp = '';
    },
    changeChecked(key) {
      this.firebase.child(`${key}/checked`).once('value', (snapshop) => {
        if (snapshop.val()) {
          this.firebase.child(`${key}/checked`).set(false);
        } else {
          this.firebase.child(`${key}/checked`).set(true);
        }
      });

      this.reloadData();
    },
    delTodo(key) {
      this.firebase.child(key).remove();
      this.reloadData();
    },
    reloadData() {
      this.wait = true;
      this.firebase.once('value', (snapshop) => {
        this.tododata = snapshop.val();
        this.switchState(this.state);
        this.countTodoNum();
        this.wait = false;
      });
    },
    countTodoNum() {
      let num = 0;
      for (let item in this.tododata) {
        if (this.tododata[item].checked === false) {
          num++;
        }
      }
      this.todoNum = num;
    },
    delAll() {
      for (let item in this.tododata) {
        if (this.tododata[item].checked === true) {
          this.firebase.child(item).remove();
        }
      }
      this.reloadData();
    },
  },
  created() {
    const firebaseConfig = {
      apiKey: 'AIzaSyBJh2B_t8tWj83IPery8GDti-ckoj5Ibm4',
      authDomain: 'test-aadcf.firebaseapp.com',
      databaseURL: 'https://test-aadcf-default-rtdb.firebaseio.com',
      projectId: 'test-aadcf',
      storageBucket: 'test-aadcf.appspot.com',
      messagingSenderId: '684439436575',
      appId: '1:684439436575:web:d1fdd6de1ba1ec8c2d442a',
      measurementId: 'G-Z5VN91CF6R',
    };
    firebase.initializeApp(firebaseConfig);
    //   firebase.database().ref('myHome').set({ home: 'us' });

    this.firebase = firebase.database().ref('todo');
    this.reloadData();
  },
});
app.mount('#app');
