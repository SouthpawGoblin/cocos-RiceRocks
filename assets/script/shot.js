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

    reuse: function(pool, host) {
        this.pool = pool;
        this.host = host;
        this.angel = this.host.rotation;
    },
    
    unuse: function() {
        this.totalLength = 0;
    },

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        switch (other.node.group) {
            case "asteroid":
                this.pool ? (this.pool.put(this.node)) : (this.node.destroy());
                break;
        }
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        
        self.collideManager = cc.director.getCollisionManager();
        self.collideManager.enabled = true;
        // self.collideManager.enabledDebugDraw = true;
        
        self.totalLength = 0;
        self.angel = self.host.rotation;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var self = this;
        if (self.totalLength > self.range) {
            self.pool ? (self.pool.put(self.node)) : (self.node.destroy());
        }
        
        var ds = self.vel * dt;
        self.node.x += ds * Math.cos(self.angel / 180 * Math.PI);
        self.node.y += -ds * Math.sin(self.angel / 180 * Math.PI);
        self.totalLength += ds;
    }
});
