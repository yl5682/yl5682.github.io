  /*
    A widget developed with Vue.js to toggle words and paragraphs.
    It allows a user to easily setup toggles with minimal effort.
    Due to the context of this project, the design on the front-end presentation
    is also kept very minmial.

    It depends on Vue.js and a stylesheet.

    Developed by Yang Li, yli60@emory.edu
    September 28, 2018
  */

  // inline word replacement
  Vue.component('v-word', {
    props: ["words"],
    data: function() {
      return {
        currentIndex: 0,
      }
    },
    template: '<span class="v-word" @click=shift><sup class="v-sup">+</sup>{{currentWord}}</span>',
    methods: {
      shift: function() {
        var next = this.currentIndex + 1;
        if (next < this.words.length) {
          Vue.set(this, "currentIndex", this.currentIndex + 1);
        } else {
          Vue.set(this, "currentIndex", 0);
        }
      }
    },
    computed: {
      currentWord: function() {
        return this.words[this.currentIndex];
      }
    }
  })

  // paragraph replacement
  Vue.component('v-paragraph', {
    data: function() {
      return {
        currentIndex: 0, // records the currently visible child, a v-element
      }
    },
    template: '<div class="v-paragraph"><sub class="v-sub" @click=shift>+</sub><slot></slot></div>',
    methods: {
      // shift method that will iterate through the children of v-paragraph
      shift: function() {
        var next = this.currentIndex + 1; // advance current index
        Vue.set(this.$children[this.currentIndex], "visible", false); // set current child as not visible
        if (next < this.$children.length) { // make the next child visible, when not reaching the end
          Vue.set(this, "currentIndex", this.currentIndex + 1);
        } else { // go back to the first child
          Vue.set(this, "currentIndex", 0);
        }
        Vue.set(this.$children[this.currentIndex], "visible", true); // set current child (after advancement) as visible
      }
    },
    mounted: function () {
      var children = this.$children;
      if (children.length != 0) {
        var hasDefault = false; // determines if a default visible child is provided
        for (var i = 0; i < children.length; i++) {
          if (children[i].visible) {
            hasDefault = true;
            this.currentIndex = i;
            break; // jump out of the loop; the first default is found
          }
        }
        if (!hasDefault) { // when no default is set, make the first child a default
          Vue.set(this.$children[0], "visible", true);
          this.currentIndex = 0;
        }
      }
    }

  });

  // elements inside a paragraph
  Vue.component('v-element', {
    props: ["default"], // boolean that can be set in the template attribute, to identify a default visible element
    data: function() {
      return {
        visible: false, // initially return false as we don't know which one should be visible
      }
    },
    template: '<div class="v-element" v-show="visible"><slot></slot></div>',
    mounted: function(){ // when mounted, determine the default element and set the v-element visible
      if (this.$props.default) {
        this.visible = true;
      }
    }
  });
