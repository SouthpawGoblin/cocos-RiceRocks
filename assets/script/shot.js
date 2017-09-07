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
        host: {
            default: null,
            type: cc.Node
        },
        
        vel: {
            default: 10
        },
        range: {
            default: 100
        }
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        self.totalLength = 0;
        self.angel = self.host.rotation;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var self = this;
        if (self.totalLength > self.range) {
            self.node.destroy();
        }
        
        var ds = self.vel * dt;
        self.node.x += ds * Math.cos(self.angel / 180 * Math.PI);
        self.node.y += -ds * Math.sin(self.angel / 180 * Math.PI);
        self.totalLength += ds;
    }
});
