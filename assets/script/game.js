var rrEvents = require("rrEvents");
var rrPools = require("rrPools");
var _ = require("underscore");

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

        splash: {
            default: null,
            type: cc.Node
        },
        ship: {
            default: null,
            type: cc.Node
        },
        label_life: {
            default: null,
            type: cc.Node
        },
        label_score: {
            default: null,
            type: cc.Node
        },

        maxAsteroids: 15,
        spawnInterval: 3,
        maxLife: 3
    },

    _spawnAsteroid: function() {
        var self = this;
        if (self.asteroidPool.size() > 0) {
            var x = (Math.random() * 2 - 1) * self.node.width / 2;
            var y = (Math.random() * 2 - 1) * self.node.width / 2;
            var ast = self.asteroidPool.get(x, y, self.node, self.asteroidPool);
            rrPools.asteroids.push(ast);
            self.node.addChild(ast);
        }
    },

    onBegin: function() {
        var self = this;
        self.schedule(self._spawnAsteroid, self.spawnInterval);
        self.splash.active = false;
        self.gameOn = true;
    },
    
    onOver: function() {
        var self = this;
        self.unschedule(self._spawnAsteroid);
        self.life = self.maxLife;
        self.score = 0;
        self.gameOn = false;
        self.label_life.getComponent(cc.Label).string = "LIFE: " + self.life;
        self.label_score.getComponent(cc.Label).string = "SCORE: " + self.score;
        _.each(rrPools.shots, function(item) {
            item.getComponent("shot").pool ? item.getComponent("shot").pool.put(item) : item.destroy();
        });
         _.each(rrPools.asteroids, function(item) {
            item.getComponent("asteroid").pool ? item.getComponent("asteroid").pool.put(item) : item.destroy();
        });
        self.splash.active = true;
    },
    
    onCrash: function() {
        var self = this;
        self.life--;
        self.label_life.getComponent(cc.Label).string = "LIFE: " + self.life;
        if (self.life === 0) {
            self.node.emit(rrEvents.$OVER);
        }
    },
    
    onScore: function() {
        var self = this;
        self.score += 100;
        self.label_score.getComponent(cc.Label).string = "SCORE: " + self.score;
    },

    onMouseUp: function (event) {
        if (!this.gameOn) {
            this.node.emit(rrEvents.$BEGIN);
        }
    },

    // use this for initialization
    onLoad: function () {
        var self = this;

        //load prefabs
        cc.loader.loadRes("prefab/asteroid", cc.Prefab, function (err, prefab) {
            self.pref_asteroid = prefab;
            self.asteroidPool = new cc.NodePool('asteroid');
            for (var i = 0; i < self.maxAsteroids; i++) {
                var ast = cc.instantiate(self.pref_asteroid); // 创建节点
                self.asteroidPool.put(ast); // 通过 putInPool 接口放入对象池
            }
        });
        
        //event register
        self.node.on(cc.Node.EventType.MOUSE_UP, self.onMouseUp, self);
        self.node.on(rrEvents.$BEGIN, self.onBegin, self);
        self.node.on(rrEvents.$OVER, self.onOver, self);
        self.node.on(rrEvents.$CRASH, self.onCrash, self);
        self.node.on(rrEvents.$SCORE, self.onScore, self);
        
        self.node.emit(rrEvents.$OVER);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
