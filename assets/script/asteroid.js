var rrEvents = require("rrEvents");

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

    reuse: function(x, y, game, pool) {
        var self = this;
        self.node.x = x;
        self.node.y = y;
        self.node.scale = Math.random() * (self.maxScale - self.minScale) + self.minScale;
        self.angVel = (Math.random() * (self.maxAngVel - self.minAngVel) + self.minAngVel) * (Math.random() > 0.5 ? 1 : -1);
        self.xVel = (Math.random() * (self.maxVel - self.minVel) + self.minVel) * (Math.random() > 0.5 ? 1 : -1);
        self.yVel = (Math.random() * (self.maxVel - self.minVel) + self.minVel) * (Math.random() > 0.5 ? 1 : -1);
        self.game = game;
        self.pool = pool;

        self.isUpdate = true;
    },

    unuse: function() {

    },

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        switch (other.node.group) {
            case "ship":
            case "missile":
                var exp = cc.instantiate(this.pref_explode);
                exp.x = this.node.x;
                exp.y = this.node.y;
                exp.scale = this.node.scale;
                this.game.addChild(exp);
                this.pool ? (this.pool.put(this.node)) : (this.node.destroy());
                this.game.emit(rrEvents.$SCORE);
                break;
        }
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        
        cc.loader.loadRes("prefab/explode", cc.Prefab, function (err, prefab) {
            self.pref_explode = prefab;
        });
        
        self.collideManager = cc.director.getCollisionManager();
        self.collideManager.enabled = true;
        // self.collideManager.enabledDebugDraw = true;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var self = this;
        if (self.isUpdate) {
            self.node.x += self.xVel * dt;
            self.node.x *= Math.abs(self.node.x) > self.game.width / 2 ? -1 : 1;
            self.node.y += self.yVel * dt;
            self.node.y *= Math.abs(self.node.y) > self.game.height / 2 ? -1 : 1;
            self.node.rotation += self.angVel * dt;
        }
    }
});
