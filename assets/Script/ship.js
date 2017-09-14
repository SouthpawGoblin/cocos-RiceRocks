var _ = require('underscore');

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
        
        ang_vel: {
            default: 180
        }, 
        acc: {
            default: 3
        },
        fireRate: {
            default: 0.1
        }
    },

    _onKeyDown: function (event) {
        var self = this;
        switch(event.keyCode) {
            case cc.KEY.a:
                self.ang_vel_cur = -self.ang_vel;
                break;
            case cc.KEY.d:
                self.ang_vel_cur = self.ang_vel;
                break;
            case cc.KEY.w:
                self.acc_cur = self.acc;    
                self.sprite.spriteFrame = self.frame_thrust;
                self.thrustAudio.play();
                break;
            case cc.KEY.space:
                self.shoot();
                break;
        }
    },

    _onKeyUp: function (event) {
        var self = this;
        switch(event.keyCode) {
            case cc.KEY.a:
            case cc.KEY.d:
                self.ang_vel_cur = 0;
                break;
            case cc.KEY.w:
                self.acc_cur = 0;
                self.sprite.spriteFrame = self.frame_normal;
                self.thrustAudio.stop();
                break;
            case cc.KEY.space:
                self.unshoot();
                break;
        }
    },

    _shoot: function() {
        var self = this;
        var missile = self.missilePool.get(self.missilePool, self.node);
        if (!missile) {
            missile = cc.instantiate(self.pref_missile);
            missile.getComponent('shot').host = self.node;
        }
        missile.x = self.node.x;
        missile.y = self.node.y;
        self.canvas.addChild(missile);
    },

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        switch (other.node.group) {
            case "asteroid": 
                var exp = cc.instantiate(this.pref_explode);
                exp.x = this.node.x;
                exp.y = this.node.y;
                this.canvas.addChild(exp);
                this.node.destroy();
                break;
        }
    },

    // use this for initialization
    onLoad: function () {
        // this.rotateAction = this.rotateAction();
        // this.node.runAction(this.rotateAction);
        var self = this;
        
        self.collideManager = cc.director.getCollisionManager();
        self.collideManager.enabled = true;
        self.collideManager.enabledDebugDraw = true;
        
        // 加载 SpriteAtlas（图集），并且获取其中的一个 SpriteFrame
        // 注意 atlas 资源文件（plist）通常会和一个同名的图片文件（png）放在一个目录下, 所以需要在第二个参数指定资源类型
        cc.loader.loadRes("img/double_ship", cc.SpriteAtlas, function (err, atlas) {
            self.frame_normal = atlas.getSpriteFrame('ship');
            self.frame_thrust = atlas.getSpriteFrame('ship_thrust');
        });
        cc.loader.loadRes("prefab/shot", cc.Prefab, function (err, prefab) {
            self.pref_missile = prefab;  
            self.missilePool = new cc.NodePool('shot');
            var initCount = 5;
            for (var i = 0; i < initCount; i++) {
                var missile = cc.instantiate(self.pref_missile); // 创建节点
                self.missilePool.put(missile); // 通过 putInPool 接口放入对象池
            }
        });
        cc.loader.loadRes("prefab/explode", cc.Prefab, function (err, prefab) {
            self.pref_explode = prefab;
        });
        
        self.ang_vel_cur = 0;
        self.acc_cur = 0;
        self.vel_cur = 0;
        self.sprite = self.node.getComponent(cc.Sprite);
        self.thrustAudio = self.node.getComponent(cc.AudioSource);
        
        self.shoot = function() {
            self.schedule(self._shoot, self.fireRate, cc.macro.REPEAT_FOREVER, 0.001)
        };
        self.unshoot = function() {
            self.unschedule(self._shoot)
        };

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, self._onKeyDown, self);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, self._onKeyUp, self);
    },

    onDestroy: function() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this._onKeyUp, this);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.node.rotation += this.ang_vel_cur * dt;
        
        this.node.x += this.vel_cur * dt * Math.cos(this.node.rotation / 180 * Math.PI);
        this.node.x *= Math.abs(this.node.x) > this.canvas.width / 2 ? -1 : 1;
        this.node.y += -this.vel_cur * dt * Math.sin(this.node.rotation / 180 * Math.PI);
        this.node.y *= Math.abs(this.node.y) > this.canvas.height / 2 ? -1 : 1;
        
        this.vel_cur += this.acc_cur * dt;
        this.vel_cur *= 0.99;
    }
});
