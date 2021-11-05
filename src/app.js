let app = Vue.createApp({
    data() {
      return {
        inventory: [],
        cart: {},
        sidebarVisible: false
      }
    },
    methods: {
      addToCart(id) {
        if (!this.cart[id]) this.cart[id] = 0;//make sure cart has item
        this.cart[id] += this.inventory[id].quantity;
        if (this.cart[id] <= 0) delete this.cart[id];//clean up cart and prevent negative quantity
        this.inventory[id].quantity = 0;//reset the quantity UI element
        console.log(this.cart);
      },
      removeAllItem(id) {
        delete this.cart[id];
        console.log("removing item", this.inventory[id].name);
      },
      toggleCart() {
        this.sidebarVisible = !this.sidebarVisible;
      }
    },
    computed: {
      cartCount() {
        //get counts with a fancy reduce statement. the 0 at the end is needed to start at 0 and prevent empty array errors
        return Object.values(this.cart).reduce((sum, current) => sum + current, 0);

        //Other way to get counts with a for loop
        /*let count = 0;
        for (const i in this.cart) {count += this.cart[i];}
        return count;*/
      }
    },
    async mounted() {
      const res = await fetch('./food.json');
      const data = await res.json();
      this.inventory = data;
      console.log(this.inventory);
    }
  })

  app.component('sidebar', {
    props: ['toggle', 'cart', 'remove', 'inventory'],
    computed: {
      cartTotal() {
        //Fancy reduce statement
        return Object.keys(this.cart)
        .reduce((sum, current)=> sum + this.cart[current] * this.inventory[current].price.USD,0)
        .toFixed(2);

        //Old foreach statemeant
        /*let sum = 0;
        Object.keys(this.cart).forEach(invIndex => {
          sum += this.cart[invIndex] * this.inventory[invIndex].price.USD;
        });
        return sum.toFixed(2);*/

      }
    },
    template: `
    <aside class="cart-container">
    <div class="cart">
      <h1 class="cart-title spread">
        <span>
          Cart
          <i class="icofont-cart-alt icofont-1x"></i>
        </span>
        <button class="cart-close" @click="toggle">&times;</button>
      </h1>

      <div class="cart-body">
        <table class="cart-table">
          <thead>
            <tr>
              <th><span class="sr-only">Product Image</span></th>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(quantity, invIndex) in cart" key="invIndex">
              <td><i class="icofont-carrot icofont-3x"></i></td>
              <td>{{ inventory[invIndex].name }}</td>
              <td>\${{ (inventory[invIndex].price.USD).toFixed(2) }}</td>
              <td class="center">{{ quantity }}</td>
              <td>\${{ (quantity * inventory[invIndex].price.USD).toFixed(2) }}</td>
              <td class="center">
                <button class="btn btn-light cart-remove" @click="remove(invIndex)">
                  &times;
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-if="Object.keys(cart).length == 0" class="center"><em>No items in cart</em></p>
        <div class="spread">
          <span><strong>Total:</strong>\${{ cartTotal }}</span>
          <button class="btn btn-light">Checkout</button>
        </div>
      </div>
    </div>
  </aside>
    `,

  })
  app.mount('#app')