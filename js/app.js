'use strict'

/**
 * 游戏框架实现
 * 准备工作
 * ** 绑定界面控件
 * ** 判断手机型号
 * 初始化
 * ** 事件绑定
 * ** ** touch事件以及click事件
 * ** loading并显示界面
 * ** 启动游戏
 * 微信分享功能
 * @return {[type]} [description]
 */
!function(){
		//绑定界面控件
	var query = {
			index: $('#index'),
			room: $('#room'),
			loading: $('#loading'),
			dialog: $('#dialog'),
			play: $('#play')
		},
		//判断手机型号
		userAgent = window.navigator.userAgent.toLowerCase(),
		isAndriod = /andriod/i.test(userAgent),
		isIOS = /iphone|ipad|ipod/i.test(userAgent),
		//app初始化
		app = {
			init: function(){
				this.initEvent();
				this.loading();
			},

			//游戏加载处理
			loading: function(){
				//判断预加载张数
				function num(){
					d ++ ;
					d == 10 && app.render(); //照片预加载10张
				};

				//_config.pic.isOpen 判断是否预加载
				if(_config.pic.isOpen){
					var pic = _config.pic.srcs;

					for(var n = pic.length,d = 0,e = 0; n > e; e++){
						var g = new Image;
						g.src =  pic[e];
						g.onload = num();
					}
				}else{
					app.render();
				}
			},

			//主游戏页面渲染
			render: function(){
				setTimeout(function(){
					query.loading.hide();
					query.index.show();
				},1000);
			},

			//事件绑定
			initEvent: function(){
				var clickEvent = "ontouchstart" in document.documentElement ? "touchstart" : "click" ,
					myapp = this;

					query.play.on(clickEvent,function(){
						var type = $(this).data('type') || 'color';

						query.index.hide();
						//启动游戏功能
						Game.init(type, query.room, myapp);
					});
					this.weixinEvent();
			},

			//微信分享功能
			weixinEvent: function(){
				var content = _lang[_config.lang];

				document.addEventListener('WeixinJSBridgeReady',function(){
					if(WeixinJSBrige){
						WeixinJSBrige.on("menu:share:appmessage", function(){
							var a = "color2" == Game.type ? content.share_txt_d : "",
								b = Game.lastScore > 0 ? a + content.share_txt1 + Game.lastScore + content.share_txt2 + Game.lastGamePercent + content.share_txt3 + Game.lastGameTxt + content.share_text4 : shareDate.tTitle;

							WeixinJSBrige.invoke(
								"sendAppMessage",
								{
									img_url: shareData.imgUrl,
									link: shareData.timeLineLink,
									desc: shareData.tContent,
									title: b
								},function() {
									// 分享成功的回调
								})
						});

						WeixinJSBridge.on("menu:share:timeline", function() {
                                var a = "color2" == Game.type ? h.share_txt_d : "", 
                                    b = Game.lastScore > 0 ? a + h.share_txt1 + Game.lastScore + h.share_txt2 + Game.lastGamePercent + h.share_txt3 + Game.lastGameTxt + h.share_txt4 : shareData.tTitle;
                                WeixinJSBridge.invoke(
                                    "shareTimeline", 
                                    {
                                        img_url: shareData.imgUrl,
                                        link: shareData.timeLineLink,
                                        desc: shareData.tContent,
                                        title: b
                                    }, function() {
                                    	// 分享成功的回调
                                    });
                            });
					}
				},false);
			}
		};
	app.init();
	window.API = {};
}();
