
window.slideSrcoll = false;

// 例子
// var filterBar = new Slidebar({
//      container: $('#test')
// })

// 需要滚动条的容器，需要加class screen-scroll
// 

var Slidebar = function(options) {

    var dafaults = {
        site: 'top',  // 触发位置
        plan: '80%',  // 距离
        time: '0.2',  // 时间
        content: '',  // html文本
        container: '' // 容器
    }

    var param = $.extend(dafaults, options);

    if (param.site == 'top' || param.site == 'bottom') param.property = 'height';
    if (param.site == 'left' || param.site == 'right') param.property = 'width';

    this.options = param;
    this.init();
}

Slidebar.prototype = {
    init: function() {

        $(document.body).on('touchmove', function(e) {
            if (window.slideSrcoll) {
                e.preventDefault();
                e.stopPropagation();
            };
        });

        var self = this;
        var shell = '<div class="slideBar g-animation"></div>';
        var backTop = '<div class="slideBar-backdrop"></div>';

        this.$content = $(shell).appendTo($(this.options.container));
        this.$backdrop = $('.slideBar-backdrop');

        if (!this.$backdrop.length) {
            this.$backdrop = $(backTop).appendTo($(this.options.container));
        };

        this.$backdrop.on('click', function(event) {
            self.hide();
        });

        this.$content.addClass('slideBar-' + this.options.site)
        this.$content.css('transition-duration', this.options.time + 's');

        this.isTouch = "ontouchend" in document ? true : false;
        this.state = 'hide';
        this.render();
    },

    // 隐藏
    hide: function() {
        var self = this;
        this.$backdrop.removeClass('active');
        setTimeout(function() {
            self.$content.hide();
        }, this.options.time * 1000);

        this.$content.css(this.options.property, '0px');
        window.slideSrcoll = false;
        $(document.body).removeClass('slideBar-body');
        this.state = 'hide';
    },

    // 打开
    show: function(plan) {
        var self = this;
        this.$content.show();

        if (this.state == 'hide') {
            this.$content.css(this.options.property, this.options.plan);
        } else if (plan == 'no') {
            this.$content.css(this.options.property, this.options.plan);
        } else {
            if (!plan) plan = '.44rem';
            this.$content.css(this.options.property, plan);
            setTimeout(function() {
                self.$content.css(self.options.property, self.options.plan);
            }, this.options.time * 1000);
        }

        this.$backdrop.addClass('active');
        this.state = 'show';
        this.redraw();

        $(document.body).addClass('slideBar-body');
        window.slideSrcoll = true;

        return this;
    },

    // 当内容改变后重新绘制计算高度
    redraw: function(){
          var self = this;
          setTimeout(function() {
              self.$content.find('.screen-scroll').each(function(index, el) {
                  self.screen({ container: $(el)})
              });
          }, 500);
    },

    // 渲染
    render: function(html) {
        if (!html) html = this.options.content;
        this.$content.html(html);
        return this;
    },

    // 滚动条
    screen: function(options){

        var $dom = null;
        var iscroll = false;
        var container = options.container;

        if (container.find('.screen').length > 0) return false;

        container.html('<div class="screen">'+container.html()+'</div>');
        $dom = container.find('.screen');

        // 判断是否有滚动条
        if ($dom.height() >= container.height()) iscroll = true;
        
        container.addClass('scorll');

        var max = $dom.height()-container.height();
            max = max - (max*2);
        
        if (iscroll) {
            
            var top = 0, trans = 0, move = 0;
            var animation = false;
            // 绑定事件
            container.find('.screen').on('touchstart', function(e){
                if (animation) return false;
                top = e.touches[0].pageY;
            })

            $dom.on('touchmove', function(e){
                if (animation) return false;
                move = (trans+e.touches[0].pageY) - top;
                $dom.css('-webkit-transform', 'translate(0,'+move+'px)');
            })

            $dom.on('touchend', function(e){
                if (animation) return false;

                trans = move;

                if (trans > 0) {
                    trans = 0;
                    animation = true;
                    $dom.addClass('mod-screen-animation');
                    $dom.css('-webkit-transform', 'translate(0,0)');
                }

                if (move < max && iscroll) {
                    trans = max;
                    animation = true;
                    $dom.addClass('mod-screen-animation');
                    $dom.css('-webkit-transform', 'translate(0,'+max+'px)');
                };

                setTimeout(function() {
                    animation = false;
                    $dom.removeClass('mod-screen-animation');
                }, 200);
            });
        }
    }
}

module.exprots = Slidebar;
