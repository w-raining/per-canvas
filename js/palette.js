function Palette(obj,ctx,mask) {
    this.obj=obj;
    this.ctx=ctx;
    this.mask=mask;
    this.width=obj.width;
    this.height=obj.height;
    this.history=[];
    this.fillStyle='#B75255';
    this.strokeStyle='#B75255';
    this.type='stroke';
    this.lineWidth=2;
    this.font='20px sans-serif';
    this.textBaseline='middle';
    this.textAlign='center';
}

Palette.prototype={
    //初始化
    init:function(){
        this.ctx.lineWidth=this.lineWidth;
        this.ctx.fillStyle=this.fillStyle;
        this.ctx.strokeStyle=this.strokeStyle;
        this.ctx.font=this.font;
        this.ctx.textBaseline=this.textBaseline;
        this.ctx.textAlign=this.textAlign;
    },
///////////////////////////功能
    //新建
    create:function () {
        this.ctx.clearRect(0,0,this.width,this.height);
    },
    //撤销
    cancel:function () {
        if(this.history.length==0){
            return;
        }
        let last=this.history.pop();
        this.ctx.putImageData(last,0,0);
    },
    //保存
    save:function (img) {
        let data=this.obj.toDataURL('image/png');
        img.src=data;
    },
    //下载
    download:function () {
        let data=this.obj.toDataURL('image/png').replace('data:image/png','data:stream/octet');
        location.href=data;
    },
///////////////////////////图形工具
    //实线
    line:function () {
        let self=this;
        self.mask.onmousedown=function (e) {
            self.init();
            let ox=e.offsetX,oy=e.offsetY;
            self.mask.onmousemove=function (e) {
                let cx=e.offsetX,cy=e.offsetY;
                self.ctx.clearRect(0,0,self.width,self.height);
                if(self.history.length>0){
                    self.ctx.putImageData(self.history[self.history.length-1],0,0);
                }
                self.ctx.beginPath();
                self.ctx.moveTo(ox,oy);
                self.ctx.lineTo(cx,cy);
                self.ctx.stroke();
            }
            self.mask.onmouseup=function () {
                self.history.push(self.ctx.getImageData(0,0,self.width,self.height));
                self.mask.onmousemove=null;
                self.mask.onmouseup=null;
            }
        }
    },
    //虚线
    dash:function () {
        let self=this;
        self.mask.onmousedown=function (e) {
            self.init();
            let ox=e.offsetX,oy=e.offsetY;
            self.mask.onmousemove=function (e) {
                let cx=e.offsetX,cy=e.offsetY;
                self.ctx.clearRect(0,0,self.width,self.height);
                if(self.history.length>0){
                    self.ctx.putImageData(self.history[self.history.length-1],0,0);
                }
                self.ctx.save();
                self.ctx.beginPath();
                self.ctx.moveTo(ox,oy);
                self.ctx.lineTo(cx,cy);
                self.ctx.setLineDash([5,2]);
                self.ctx.stroke();
                self.ctx.restore();
            }
            self.mask.onmouseup=function () {
                self.history.push(self.ctx.getImageData(0,0,self.width,self.height));
                self.mask.onmousemove=null;
                self.mask.onmouseup=null;
            }
        }
    },
    //铅笔
    pencil:function(){
        let self=this;
        self.mask.onmousedown=function (e) {
            self.init();
            let ox=e.offsetX,oy=e.offsetY;
            self.ctx.clearRect(0,0,self.width,self.height);
            self.ctx.beginPath();
            self.ctx.moveTo(ox,oy);
            self.mask.onmousemove=function (e) {
                let cx=e.offsetX,cy=e.offsetY;
                if(self.history.length>0){
                    self.ctx.putImageData(self.history[self.history.length-1],0,0);
                }
                self.ctx.lineTo(cx,cy);
                // self.ctx.closePath();  千万不可以加关闭路径
                self.ctx[self.type]();
            }
            self.mask.onmouseup=function () {
                self.history.push(self.ctx.getImageData(0,0,self.width,self.height));
                self.mask.onmousemove=null;
                self.mask.onmouseup=null;
            }
        }
    },
    //圆
    circle:function () {
        let self=this;
        self.mask.onmousedown=function (e) {
            self.init();
            let ox=e.offsetX,oy=e.offsetY;
            self.mask.onmousemove=function (e) {
                let cx=e.offsetX,cy=e.offsetY;
                let r=Math.sqrt(Math.pow((cx-ox),2)+Math.pow((cy-oy),2));
                self.ctx.clearRect(0,0,self.width,self.height);
                if(self.history.length>0){
                    self.ctx.putImageData(self.history[self.history.length-1],0,0);
                }
                self.ctx.beginPath();
                self.ctx.moveTo(ox+r,oy);
                self.ctx.arc(ox,oy,r,0,Math.PI*2,false);
                self.ctx.closePath();
                self.ctx[self.type]();
            }
            self.mask.onmouseup=function () {
                self.history.push(self.ctx.getImageData(0,0,self.width,self.height));
                self.mask.onmousemove=null;
                self.mask.onmouseup=null;
            }
        }
    },
    //矩形
    rectangle:function () {
        let self=this;
        self.mask.onmousedown=function(e){
            let ox=e.offsetX,oy=e.offsetY;
            self.mask.onmousemove=function (e) {
                self.init();
                let cx=e.offsetX,cy=e.offsetY;
                self.ctx.clearRect(0,0,self.width,self.height);
                if(self.history.length>0){
                    self.ctx.putImageData(self.history[self.history.length-1],0,0);
                }
                self.ctx.beginPath();
                self.ctx.rect(ox,oy,cx-ox,cy-oy);
                self.ctx.closePath();
                self.ctx[self.type]();
            }
            self.mask.onmouseup=function () {
                self.history.push(self.ctx.getImageData(0,0,self.width,self.height));
                self.mask.onmousemove=null;
                self.mask.onmouseup=null;
            }
        }
    },
    //圆角矩形
    roundrect:function (r) {
        let self=this;
        self.mask.onmousedown=function(e){
            self.init();
            let ox=e.offsetX,oy=e.offsetY;
            self.mask.onmousemove=function (e) {
                let cx=e.offsetX,cy=e.offsetY,
                    w=cx-ox,h=cy-oy;
                self.ctx.clearRect(0,0,self.width,self.height);
                if(self.history.length>0){
                    self.ctx.putImageData(self.history[self.history.length-1],0,0);
                }
                self.ctx.beginPath();
                self.ctx.moveTo(ox-w+r,oy-h);
                self.ctx.lineTo(ox+w-r,oy-h);
                self.ctx.quadraticCurveTo(cx,oy-h,cx,oy-h+r);
                self.ctx.lineTo(cx,cy-r);
                self.ctx.quadraticCurveTo(cx,cy,cx-r,cy);
                self.ctx.lineTo(ox-w+r,cy);
                self.ctx.quadraticCurveTo(ox-w,cy,ox-w,cy-r);
                self.ctx.lineTo(ox-w,oy-h+r);
                self.ctx.quadraticCurveTo(ox-w,oy-h,ox-w+r,oy-h);
                self.ctx.closePath();
                self.ctx[self.type]();
            }
            self.mask.onmouseup=function () {
                self.history.push(self.ctx.getImageData(0,0,self.width,self.height));
                self.mask.onmousemove=null;
                self.mask.onmouseup=null;
            }
        }
    },
    //多边形
    polygon:function (n) {
        let self=this;
        self.mask.onmousedown=function (e) {
            self.init();
            let ox=e.offsetX,oy=e.offsetY;
            self.mask.onmousemove=function (e) {
                let cx=e.offsetX,cy=e.offsetY;
                let r=Math.sqrt(Math.pow((cx-ox),2)+Math.pow((cy-oy),2));
                self.ctx.clearRect(0,0,self.width,self.height);
                if(self.history.length>0){
                    self.ctx.putImageData(self.history[self.history.length-1],0,0);
                }
                self.ctx.beginPath();
                self.ctx.moveTo(ox+r,oy);
                for(let i=0;i<n;i++){
                    let angle=(360/n)*(Math.PI/180);
                    let x=ox+r*Math.cos(angle*i),y=oy+r*Math.sin(angle*i);
                    self.ctx.lineTo(x,y);
                }
                self.ctx.closePath();
                self.ctx[self.type]();
                // self.ctx.stroke();
            }
            self.mask.onmouseup=function () {
                self.history.push(self.ctx.getImageData(0,0,self.width,self.height));
                self.mask.onmousemove=null;
                self.mask.onmouseup=null;
            }
        }
    },
    //多角形
    star:function (n) {
        let self=this;
        self.mask.onmousedown=function (e) {
            self.init();
            let ox=e.offsetX,oy=e.offsetY;
            self.mask.onmousemove=function (e) {
                let cx=e.offsetX,cy=e.offsetY;
                let R=Math.sqrt(Math.pow((cx-ox),2)+Math.pow((cy-oy),2));
                let r=R/3;
                let angle=360/(n*2)*(Math.PI/180);
                self.ctx.clearRect(0,0,self.width,self.height);
                if(self.history.length>0){
                    self.ctx.putImageData(self.history[self.history.length-1],0,0);
                }
                self.ctx.beginPath();
                // self.ctx.moveTo(ox+R,oy);
                for(let i=0;i<n*2;i++){
                    if(i%2==0){
                        self.ctx.lineTo(ox+R*Math.cos(angle*i),oy+R*Math.sin(angle*i))
                    }else{
                        self.ctx.lineTo(ox+r*Math.cos(angle*i),oy+r*Math.sin(angle*i))
                    }
                }
                self.ctx.closePath();
                self.ctx[self.type]();
            }
            self.mask.onmouseup=function () {
                self.history.push(self.ctx.getImageData(0,0,self.width,self.height));
                self.mask.onmousemove=null;
                self.mask.onmouseup=null;
            }
        }
    },
    //橡皮
    clear:function (w,h,eraser) {
        let self=this;
        self.mask.onmousedown=function(){
            if(self.history.length>0){
                self.ctx.putImageData(self.history[self.history.length-1],0,0);
            }
            eraser.style.display='block';
            eraser.style.width=`${w}px`;
            eraser.style.height=`${h}px`;
            self.mask.onmousemove=function (e) {
                let cx=e.offsetX-w/2,cy=e.offsetY-h/2;
                if(cx>=self.width-w){
                    cx=self.width-w;
                }
                if(cx<=0){
                    cx=0;
                }
                if(cy>=self.height-h){
                    cy=self.height-h;
                }
                if(cy<=0){
                    cy=0;
                }
                eraser.style.left=cx+'px';
                eraser.style.top=cy+'px';
                self.ctx.clearRect(cx,cy,w,h);
            };
            self.mask.onmouseup=function () {
                self.history.push(self.ctx.getImageData(0,0,self.width,self.height));
                eraser.style.display='none';
                self.mask.onmousemove=null;
                self.mask.onmouseup=null;
            }
        }
    },
    //文字
    word:function () {
        let self=this;
        self.mask.onmousedown=function(e){
            let ox=e.offsetX,oy=e.offsetY;
            let div=document.createElement('div');
            div.style.cssText=`
                    min-width:50px;height:30px;position:absolute;
                    left:${ox}px;top:${oy}px;background:#fff;
                `;
            div.contentEditable=true;
            self.mask.appendChild(div);
            self.mask.onmousedown=null;
            self.area=div;
            self.area.onmousedown=function (e) {
                let ox = e.clientX - this.offsetLeft, oy = e.clientY-this.offsetTop;
                self.area.onmousemove=function (e) {
                    if(self.history.length>0){
                        self.ctx.putImageData(self.history[self.history.length-1],0,0);
                    }
                    let cx = e.clientX, cy = e.clientY;
                    let lefts = cx - ox, tops = cy - oy;
                    self.area.style.left = `${lefts}px`;
                    self.area.style.top = `${tops}px`;
                }
                self.area.onmouseup = function () {
                    self.area.onmousemove = null;
                    self.mask.onmouseup = null;
                }
            }
            self.area.onblur=function () {
                self.ctx.word=self.text;
                self.ctx.font=self.font;
                self.ctx.textAlign=self.textAlign;
                self.ctx.textBaseline=self.textBaseline;
                self.ctx.fillText(this.innerText,this.offsetLeft,this.offsetTop);
                this.parentNode.removeChild(this);
                self.area=null;
                self.history.push(self.ctx.getImageData(0,0,self.width,self.height));
            }
        }
    },

    //剪切
    clip:function (clipBtn) {
        let self = this;
        self.clipBtn=clipBtn;
        self.mask.onmousedown = function (e) {
            self.init();
            let ox=e.offsetX;
            let oy=e.offsetY;
            let minx,miny,w,h;
            self.mask.onmousemove=function (e) {//选取剪切范围
                self.init();
                let cx=e.offsetX;
                let cy=e.offsetY;
                minx=ox>cx?cx:ox;
                miny=oy>cy?cy:oy;
                w=Math.abs(cx-ox);//取绝对值
                h=Math.abs(cy-oy);
                clipBtn.style.display="block";//虚线框出现
                clipBtn.style.left=minx+'px';//剪切框离画布的左边距
                clipBtn.style.top=miny+'px';
                clipBtn.style.width=w+'px';//剪切宽高
                clipBtn.style.height=h+'px';
            };
            self.mask.onmouseup=function () {
                self.mask.onmouseup=null;
                self.mask.onmousemove=null;
                self.temp=self.ctx.getImageData(minx,miny,w,h);//获取剪切框内容赋给temp
                self.ctx.clearRect(minx,miny,w,h);
                self.history.push(self.ctx.getImageData(0,0,self.width,self.height));
                self.ctx.putImageData(self.temp,minx,miny);
                self.drag(minx,miny,w,h,clipBtn);//拖拽剪切框
            }
        }
    },
    drag: function (x,y,w,h,clipBtn) {//在剪切框范围内才能拖拽
        let self=this;
        self.mask.onmousemove=function (e) {
            let ox=e.offsetX;
            let oy=e.offsetY;
            if (ox>x&&ox<w+x&&oy>y&&oy<h+y) {//条件：点击点要在剪切框内即要大于左边且小于左边加剪切框的宽
                self.mask.style.cursor="move";//光标：对象可移动
            } else {
                self.mask.style.cursor="default";//默认光标
                return;
            }
        };
        self.mask.onmousedown=function (e) {
            let ox=e.offsetX;
            let oy=e.offsetY;
            let dx=ox-x;
            let dy=oy-y;
            if (ox>x&&ox<w+x&&oy>y&&oy<h+y) {
                self.mask.style.cursor="move";
            } else {
                self.mask.style.cursor="default";
                return;
            }
            self.mask.onmousemove=function (e) {
                self.ctx.clearRect(0,0,self.width,self.height);
                if (self.history.length!=0) {
                    self.ctx.putImageData(self.history[self.history.length-1],0,0)
                }
                let cx=e.offsetX;
                let cy=e.offsetY;
                let left=cx-dx;
                let top=cy-dy;
                if(left<0){
                    left=0;
                }
                if(left>self.width-w){
                    left=self.width-w
                }

                if(top<0){
                    top=0;
                }
                if(top>self.height-h){
                    top=self.height-h
                }
                clipBtn.style.left=left+'px';
                clipBtn.style.top=top+'px';
                x=left;
                y=top;
                self.ctx.putImageData(self.temp,left,top);
            }
            self.mask.onmouseup=function () {
                self.mask.onmouseup=null;
                self.mask.onmousemove=null;
                self.drag(x,y,w,h,clipBtn)
            }
        }
    },





}