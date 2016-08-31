//******************************************************************************************************************************
    /*
     * 
     * @Jquery自定义弹出框
     * @method dialog
     * @author huangdongyang
     * @time   2015-5-21
     * @updatetime   2015-6-03  
     * 
     */
    //******************************************************************************************************************************   
    require("./dialog.css"); 
    
    (function($){        
        $.fn.dialog = function(cfg){
            return this.each(function(){                
                $.dialog(cfg);                
            });            
        }
        
        $.dialog = function(cfg){
            var defaults = {
                // 宽度
                width          : 300,    
                // 高度
                height         : 150,            
                // 自动宽高
                sizeAuto       : false,
                // 内容 {String} || {Jquery obj}
                content        : '这是一个弹出对话框话框!',
                //
                src            : "",
                // 窗口
                windowDom      : window, 
                // 延时关闭
                delay          : 0,   
                // 标题
                title          : '提示',
                // 关闭按钮
                closeBtn       : true, 
                // 关闭按钮文字
                closeTxt       : '×',
                // 确认按钮
                sure           : false,  
                // 确认按钮文字
                sureTxt        : '确定',  
                // 取消按钮
                cancel         : false,  
                // 取消按钮文字
                cancelTxt      : '取消',
                // 是否拖拽
                drag           : false, 
                // 背景遮罩
                mask           : true,  
                // 是否点击遮罩关闭
                clickMaskClose : false,  
                // 关闭事件
                closeHandler   : $.noop(),
                // 确认事件
                sureHandler    : $.noop(),
                // 取消事件
                cancelHandler  : $.noop(),
                // 渲染前事件
                before         : $.noop(),
                // 渲染完成事件
                onload         : $.noop(),
                // 自定义class
                addClass       : ''
            }

            var config   = $.extend({},defaults,cfg);        
            var dialog   = null;
            var _mask    = null;
            var handlers = []; 

            // 渲染
            var init = function(){	

                //渲染之前
                typeof config.before === "function" && config.before.call(dialog);

                //
                renderUI(); 

                // 绑定事件
                bindUI(); 

                // 初始化UI
                syncUI();

                // 渲染完成
                typeof config.onload === "function" && config.onload.call(dialog);
            };

            // 渲染UI
            var renderUI = function(){ 

                dialog = $("<div class='custom-dialog'></div>"); 

                // 是否有title
                config.title && titleRenderUI();	

                // 渲染主体
                bodyRenderUI();	

                // 渲染按钮
                buttonRenderUI();

                dialog.appendTo(config.windowDom.document.body);

                // 是否显示遮罩
                if(config.mask){
                    _mask = $("<div class='custom-dialog-mask'></div>");
                    _mask.appendTo(config.windowDom.document.body);
                }	

                // 定时消失
                config.delay && setTimeout( function(){ close(); }, config.delay ); 
            };

            // 事件bind
            var bindUI = function(){

                // 点击遮罩关闭
                config.clickMaskClose && _mask && _mask.click(function(){ close();});	 

                // 绑定事件
                config.sure && dialog.delegate('.sure','click',function(){                	
                    fire('sure');
                    destroy();	
                    clearHandle();
                    return false;
                }); 

                dialog.delegate('.cancel,.custom-dialog-close','click',function(){               
                    fire('close'); 
                    destroy();
                    clearHandle(); 
                    return false;
                });

                dialog.delegate('.coloe-tip','click',function(){                    
                    $(this).parents(".dialog-tip-wrap").remove();
                });
                
                if(config.sure && config.sureHandler){ 
                    on('sure',config.sureHandler);
                }

                if(config.cancel && config.cancelHandler){
                    on('close',config.cancelHandler);  
                }

                // 拖拽
                config.drag && drag();
            }; 

            //拖拽
            var drag =  function() {
                
                if (!dialog) {
                    $(document).unbind("mouseover").unbind("mouseup");
                    return;
                }
                var drag = false;
                var currentX = 0, currentY = 0, posX = dialog.css("left"), posY = dialog.css("top");
                
                //鼠标按下
                dialog.mousedown(function(e) {
                    drag = true;
                    currentX = e.pageX;
                    currentY = e.pageY;							 
                }).css("cursor", "move");
                
                // 鼠标移动
                $(document).mousemove(function(e) {
                    if (drag) {
                        var nowX = e.pageX, nowY = e.pageY;
                        var disX = nowX - currentX, disY = nowY - currentY;
                        dialog.css("left", parseInt(posX) + disX).css("top", parseInt(posY) + disY);
                    }					   
                });
                
                // 鼠标抬起
                $(document).mouseup(function() {
                    drag = false;
                    posX = dialog.css("left");
                    posY = dialog.css("top");
                });
            }


            // 初始化样式
            var syncUI = function(flag){
                
                //拖拽重新调整位置
                if(flag){
                    dialog.animate({  
                        width: dialog.width()+'px',
                        height: dialog.height()+'px',
                        marginLeft  : -((dialog.width()+8)/2)+'px', 
                        marginTop   : -((dialog.height()+8)/2)+'px'
                    });
                }
                //
                else{
                    
                    if(config.sizeAuto){
                        config.height = dialog.height();
                        config.width  = dialog.width(); 
                    }                    
                    
                    dialog.css({
                        width       : config.width+'px',
                        marginLeft  : -((config.width+8)/2)+'px', 
                        marginTop   : -((config.height+8)/2)+'px'
                    });

                    //修复ie6 
                    if ('undefined' == typeof(document.body.style.maxHeight)){                 
                        dialog.css({
                            marginTop  : '0px'                      
                        });
                    }
                    dialog.addClass(config.addClass);
                }

            };

            // 提示效果title
            var titleRenderUI = function(){
                var tit = "<div class='custom-dialog-tit'>"+config.title+"</div>";               
                dialog.append(tit);
            };


            // 按钮UI
            var buttonRenderUI = function(){		
                if(config.closeBtn){
                    var closeBtn = "<div class='custom-dialog-close'>"+config.closeTxt+"</div>";
                    dialog.append(closeBtn); 		
                }
                if(config.sure || config.cancel){
                    var btn  = "<div class='custom-dialog-button'>"; 		
                        if(config.sure)   btn += "<a class='btn sure' href='javascript:'>"+config.sureTxt+"</a>";
                        if(config.cancel) btn += "<a class='btn cancel' href='javascript:'>"+config.cancelTxt+"</a>";
                        btn += "</div>";
                    dialog.append(btn); 
                }

            };

            // body UI
            var bodyRenderUI = function(){   
                
                if(!config.src){
                    if (config.content instanceof jQuery) {
                        config.content.show();
                    }
                }else{
                    config.content = $("<iframe width="+parseFloat(config.width)+" height="+parseFloat(config.height)+" scrolling=no frameborder=0 src='"+config.src+"'></iframe>");
                }
                
                var customBody = $("<div class='custom-dialog-body'></div>");
                customBody.append(config.content);
                dialog.append(customBody);
            };
            
            // errtip
            var tip = function(text){                
                var tip = $("<div class='dialog-tip-wrap'><span>"+text+"</span><span class='coloe-tip'>×</span></div>");            
                dialog.append(tip);
                setTimeout(function(){
                    
                    tip.remove();
                                        
                },1500);
            }

            // 关闭
            var close = function(){ 
                destroy();	            
                clearHandle();
            };

            // 销毁
            var destroy = function(){
                _mask  && _mask.fadeOut("fast",function() { $(this).remove() });
                dialog && dialog.remove();
                dialog  = null; 
                typeof config.closeHandler === "function" && config.closeHandler.call(dialog);
            };

            // 清除事件
            var clearHandle = function(){
                handlers = []; 
                $(document).unbind("mouseover").unbind("mouseup");
            };

            //绑定事件
            var on = function(type,handler){	
                if (typeof handlers[type] === "undefined") {		
                    handlers[type] = [];
                }
                if (typeof handler === "function") {
                    handlers[type].push(handler);		
                }    
                return this; 
            };

            // 触发事件
            var fire = function(type){	
                var arrayEvent = handlers[type];
                if (arrayEvent instanceof Array) { 
                    for (var i=0; i < arrayEvent.length; i++) {
                        if (typeof arrayEvent[i] === "function"){
                            arrayEvent[i]({type: type});  

                            //执行后删除事件
                            arrayEvent.splice(i,1); 
                        } 
                    }
                }    
                return this;  
            };

            // 初始化
            init();
            
            $.extend($.dialog,{
                close:close,
                tip : tip,
                setPosition:function(){
                    syncUI(true);
                }
            })
            
        };
        
    })($);