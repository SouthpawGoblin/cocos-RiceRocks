cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...

        canvas: {
            default: null,
            type: cc.Node
        },

        minScale: 0.2,
        maxScale: 1.5,
        minAngVel: 45,
        maxAngVel: 360,
        minVel: 50,
        maxVel: 100,

        angVel: 0,
        xVel: 0,
        yVel: 0,

        isUpdate: false
    },

    reuse: function(x, y, canvas) {
        var self = this;
        self.node.x = x;
        self.node.y = y;
        self.node.scale = Math.random() * (self.maxScale - self.minScale) + self.minScale;
        self.angVel = (Math.random() * (self.maxAngVel - self.minAngVel) + self.minAngVel) * (Math.random() > 0.5 ? 1 : -1);
        self.xVel = (Math.random() * (self.maxVel - self.minVel) + self.minVel) * (Math.random() > 0.5 ? 1 : -1);
        self.yVel = (Math.random() * (self.maxVel - self.minVel) + self.minVel) * (Math.random() > 0.5 ? 1 : -1);
        self.canvas = canvas;

        self.isUpdate = true;
    },

    unuse: function() {

    },

    // use this for initialization
    onLoad: function () {
        // var self = this;
        // self.angVel = 0;
        // self.xVel = 0;
        // self.yVel = 0;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var self = this;
        if (self.isUpdate) {
            self.node.x += self.xVel * dt;
            self.node.x *= Math.abs(self.node.x) > self.canvas.width / 2 ? -1 : 1;
            self.node.y += self.yVel * dt;
            self.node.y *= Math.abs(self.node.y) > self.canvas.height / 2 ? -1 : 1;
            self.node.rotation += self.angVel * dt;
        }
    }
});
