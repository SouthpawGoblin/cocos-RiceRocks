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

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        console.log('on collision enter');
    
        // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        var world = self.world;
    
        // 碰撞组件的 aabb 碰撞框
        var aabb = world.aabb;
    
        // 上一次计算的碰撞组件的 aabb 碰撞框
        var preAabb = world.preAabb;
    
        // 碰撞框的世界矩阵
        var t = world.transform;
    
        // 以下属性为圆形碰撞组件特有属性
        var r = world.radius;
        var p = world.position;
    
        // 以下属性为 矩形 和 多边形 碰撞组件特有属性
        var ps = world.points;
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        
        self.collideManager = cc.director.getCollisionManager();
        self.collideManager.enabled = true;
        self.collideManager.enabledDebugDraw = true;
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