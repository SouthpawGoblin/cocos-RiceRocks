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
        
        ang_vel: {
            default: 180
        }, 
        acc: {
            default: 3
        }
    },

    rotateAction: function() {
        var rotateLeft = cc.rotateBy(2, 360);
        var rotateRight = rotateLeft.reverse();
        return cc.repeatForever(cc.sequence(rotateLeft, rotateRight));
    },
    
    setInputControl: function () {
        var self = this;
        // 添加键盘事件监听
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // 有按键按下时，判断是否是我们指定的方向控制键，并设置向对应方向加速
            onKeyPressed: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                        self.ang_vel_cur = -self.ang_vel;
                        break;
                    case cc.KEY.d:
                        self.ang_vel_cur = self.ang_vel;
                        break;
                    case cc.KEY.w:
                        self.acc_cur = self.acc;    
                        self.node.getComponent(cc.Sprite).spriteFrame = self.frame_thrust;
                        break;
                }
            },
            // 松开按键时，停止向该方向的加速
            onKeyReleased: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                    case cc.KEY.d:
                        self.ang_vel_cur = 0;
                        break;
                    case cc.KEY.w:
                        self.acc_cur = 0;
                        self.node.getComponent(cc.Sprite).spriteFrame = self.frame_normal;
                        break;
                }
            }
        }, self.node);
    },

    // use this for initialization
    onLoad: function () {
        // this.rotateAction = this.rotateAction();
        // this.node.runAction(this.rotateAction);
        var self = this;
        
        // 加载 SpriteAtlas（图集），并且获取其中的一个 SpriteFrame
        // 注意 atlas 资源文件（plist）通常会和一个同名的图片文件（png）放在一个目录下, 所以需要在第二个参数指定资源类型
        cc.loader.loadRes("img/double_ship", cc.SpriteAtlas, function (err, atlas) {
            self.frame_normal = atlas.getSpriteFrame('ship');
            self.frame_thrust = atlas.getSpriteFrame('ship_thrust');
        });
        
        self.ang_vel_cur = 0;
        self.acc_cur = 0;
        self.vel_cur = 0;
        
        //actual attributes
        self.setInputControl();
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.node.rotation += this.ang_vel_cur * dt;
        
        this.node.x += this.vel_cur * dt * Math.cos(this.node.rotation / 180 * Math.PI);
        this.node.y += -this.vel_cur * dt * Math.sin(this.node.rotation / 180 * Math.PI);
        
        this.vel_cur += this.acc_cur * dt;
        this.vel_cur *= 0.99;
    },
});
