Component({
    options: {
        multipleSlots: true
    },
    properties: {
        title: {
            type: String,
            value: '标题'
        },
        content: {
            type: String,
            value: '弹窗内容'
        },
        confirmText: {
            type: String,
            value: '确定'
        }
    },

    data: {
        isShow: false
    },
    methods: {

        //隐藏弹框
        hideDialog() {
            this.setData({
                isShow: !this.data.isShow
            })
        },
        //展示弹框
        showDialog() {
            this.setData({
                isShow: !this.data.isShow
            })
        },
        /**
        * triggerEvent 组件之间通信
        */
        confirmEvent() {
            this.triggerEvent("confirmEvent");
        },

        bindGetUserInfo() {
            this.triggerEvent("bindGetUserInfo");
        }

    }
})
