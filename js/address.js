new Vue({
    // Vue实例中的this指向该实例本身
    el: '.container',
    data: {
        limitNum: 3,
        addressList: [],
        currentIndex: 0,
        less: true,
        shippingMethod: 1
    },
    mounted: function () {
        // mounted 最好配合nextTick使用，以保证DOM以完全插入。
        this.$nextTick(function () {
            this.getAddressList();
        })
    },
    computed: {
        filterAddress: function () {
            return this.addressList.slice(0, this.limitNum);
        }
    },
    methods: {
        getAddressList: function () {
            this.$http.get("data/address.json", { id: 1 }).then((res) => {
                res = res.data;
                if (res.status != "0") {
                    this.addressList = res.result;
                }
            })
        },
        loadMore: function() {
            if(this.less) {
                this.limitNum = this.addressList.length;
                this.less = false;
            }
            else {
                this.limitNum = 3;
                this.less = true;
            }
            
        },
        setDefault: function(addressId) {
            this.addressList.forEach((address, index) => {
                if(address.addressId == addressId) {
                    address.isDefault = true;
                }
                else {
                    address.isDefault = false;
                }
            })
        }
    }
})