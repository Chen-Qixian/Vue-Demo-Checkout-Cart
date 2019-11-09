new Vue({
    el: "#app",
    data:{
        productList:[],
        totalMoney:0,
        checkAllFlag: false,
        delFlag: false,
        curProduct:{}
    },
    filters: {
        formatMoney: function(value) {
            return "¥ " + value.toFixed(2);
        }
    },
    mounted: function(){
        this.cartView();
    },
    methods: {
        cartView: function() {
            // 优化：箭头函数的this指向父级作用域的this
            this.$http.get("data/cart.json", {"id":123}).then(res => {
                this.productList = res.body.result.productList;
                this.totalMoney = res.body.result.totalMoney;
            })
        },
        changeQuentity:function(product, way) {
            product.productQuentity += way;
            if(product.productQuentity  < 1) product.productQuentity = 1;
            this.calcTotalPrice();
        },
        selectedProduct: function(item) {
            if(typeof item.checked == 'undefined') {
                // Vue.set(item, 'checked', true); // 全局注册checked字段，为item添加一个属性checked
                this.$set(item, 'checked', true); // 局部注册
            }
            else {
                item.checked = !item.checked;
            }
            this.calcTotalPrice();
        },
        checkAll: function(flag) {
            this.checkAllFlag = flag;
            this.productList.forEach((item,index) => {
                if(typeof item.checked == 'undefined') {
                    this.$set(item, "checked", this.checkAllFlag);
                }
                else {
                    item.checked = this.checkAllFlag;
                }
            })
            this.calcTotalPrice();
        },
        calcTotalPrice: function() {
            this.totalMoney = 0;
            this.productList.forEach((item, index) => {
                if(item.checked) {
                    this.totalMoney += item.productPrice * item.productQuentity;
                }
            })
        },
        isNotEmpty: function(item) {
            return item.parts.length == 0 ? false : true;
        },
        delConfirm: function(item) {
            this.delFlag = true;
            this.curProduct = item;
        },
        delProduct: function() {
            let index = this.productList.indexOf(this.curProduct);
            this.productList.splice(index, 1);
            this.delFlag = false;
        }
    }
});

// 过滤器第一个参数为过滤的值，第二个参数为接收的参数
Vue.filter('money', function(value, type) {
    return value.toFixed(2) + " " + type;
})