export class PageController {
    $container: HTMLElement;
    $main: HTMLElement;
    $pages: HTMLCollection;
    $navs: HTMLCollection;
    isWheeling: boolean;
    pageIndex: number;
    pageCount: number;
    timeout: number;
    delay: number;
    constructor(main: HTMLElement,container: HTMLElement, pages: HTMLCollection, navs: HTMLCollection, timeout: number, delay: number) {
        this.$main = main;
        this.$container = container;
        this.$pages = pages;
        this.$navs = navs;
        this.pageCount = this.$pages.length;
        this.isWheeling = false;
        this.pageIndex = -1;
        this.timeout = timeout;
        this.delay = delay;
        this.init();
    }
    init() {
        let baseHeight = this.$main.clientHeight;
        this.$container.style.height = (this.pageCount * baseHeight) + "px";
        for(let i = 0; i< this.pageCount; i++) {
            (<HTMLElement>this.$pages.item(i)).style.height = baseHeight+"px";
        }
        window.onresize = ()=>{
            let baseHeight = this.$main.clientHeight;
            this.$container.style.height = (this.pageCount * baseHeight) + "px";
            for(let i = 0; i< this.pageCount; i++) {
                (<HTMLElement>this.$pages.item(i)).style.height = baseHeight+"px";
            }
            this.$container.style.transform = "translateY("+(0-baseHeight * this.pageIndex) + "px"+")";
        };
        for (let i=0; i<this.pageCount; i++) {
            (<HTMLElement>this.$navs.item(i)).onclick = (e:MouseEvent)=>{
                let oldNav = this.$navs.item(this.pageIndex);
                if(oldNav) {
                    oldNav.classList.remove('active');
                }
                e.srcElement.classList.add('active');
                this.pageTo(i);
            }
        }
        this.$container.style.transform =  "translateY("+(0-this.pageIndex * baseHeight) + "px"+")";
        this.$container.style.transition = "transform " + this.timeout+"ms";
        this.pageTo(0);
    }
    pageTo(index:number) {
        this.isWheeling = false;
        let newIndex = index;
        if(newIndex === this.pageIndex || newIndex < 0 || newIndex >= this.pageCount) {
            return;
        }
        let old = this.$navs.item(this.pageIndex);
        if(old) {
            old.classList.remove('active');
        }
        this.pageIndex = newIndex;
        this.$navs.item(newIndex).classList.add('active');
        let baseHeight = this.$main.clientHeight;
        this.$container.style.transform = "translateY("+(0-baseHeight * newIndex) + "px"+")";
        setTimeout(()=>{
            if(!(this.pageIndex < 0)){
                let $oldPage = this.$pages.item(this.pageIndex);
                $oldPage.classList.remove("show");
            }
            let $nextPage = this.$pages.item(newIndex);
            $nextPage.classList.add("show");

        }, this.timeout);
    }
    doScroll(newIndex) {
        let old = this.$navs.item(this.pageIndex);
        if(old) {
            old.classList.remove('active');
        }
        this.$navs.item(newIndex).classList.add('active');
        let baseHeight = this.$main.clientHeight;
        this.isWheeling = true;
        this.$container.style.transform = "translateY("+(0-baseHeight * newIndex) + "px"+")";
        setTimeout(()=>{
            if(!(this.pageIndex < 0)){
                let $oldPage = this.$pages.item(this.pageIndex);
                $oldPage.classList.remove("show");
            }
            let $nextPage = this.$pages.item(newIndex);
            $nextPage.classList.add("show");
            setTimeout(()=>{
                this.pageIndex = newIndex;
                this.isWheeling = false;
            }, this.delay);
        }, this.timeout);
    }
    pageUp() {
        if(this.isWheeling) return;
        let newIndex = this.pageIndex + 1;
        if(newIndex > (this.pageCount - 1)) {
            return;
        }
        this.doScroll(newIndex);
    }
    pageDown(){
        if(this.isWheeling) return;
        let newIndex = this.pageIndex - 1;
        if(newIndex < 0) {
            return;
        }
        this.doScroll(newIndex);
    }
}

export class AppController{
    $imgCollection: HTMLCollection;
    $descCollection: HTMLCollection;
    $triggerCollection: HTMLCollection;
    timeout:number;
    appIndex: number;
    loopID:number;
    manualTime: number;
    constructor(imgs: HTMLCollection, descs: HTMLCollection, trigs: HTMLCollection, timeout: number) {
        this.$imgCollection = imgs;
        this.$triggerCollection = trigs;
        this.$descCollection = descs;
        this.timeout = timeout;
        this.init();
        // this.loopStart();
    }
    init(){
        this.manualTime = (new Date()).getTime();
        this.loopID = -1;
        this.appIndex = 0;
        this.$imgCollection.item(0).classList.add('show');
        this.$descCollection.item(0).classList.add('show');
        this.$triggerCollection.item(0).classList.add('on');
        for(let i=0; i<this.$triggerCollection.length; i++) {
            (<HTMLElement>this.$triggerCollection.item(i)).onclick = ()=>{
                this.manualTime = (new Date()).getTime();
               this.triggerTo(i);
            }
        }
    }
    triggerTo(index:number) {
        if(index<0 ||index>=this.$imgCollection.length || index === this.appIndex) return;
        let oldIndex = this.appIndex;
        this.appIndex = index;
        this.$imgCollection.item(oldIndex).classList.remove('show');
        this.$descCollection.item(oldIndex).classList.remove('show');
        this.$triggerCollection.item(oldIndex).classList.remove('on');
        this.$imgCollection.item(index).classList.add('show');
        this.$descCollection.item(index).classList.add('show');
        this.$triggerCollection.item(index).classList.add('on');
    }
    loopStart(){
        this.loopID = window.setInterval(()=>{
            let current = (new Date()).getTime();
            if((current - this.manualTime) > this.timeout) {
                let newIndex = this.appIndex + 1;
                if(newIndex >= this.$triggerCollection.length){
                    newIndex = 0;
                }
                this.triggerTo(newIndex);
            }
        }, this.timeout)
    }
    loopStop() {
        window.clearInterval(this.loopID)
    }
}

export class BikeController {
    $label:HTMLElement;
    $partList: HTMLCollection;
    partIndex: number;
    constructor(label: HTMLElement, part: HTMLCollection){
        this.$label = label;
        this.$partList = part;
        this.init();
    }
    init(){
        this.partIndex = 0;
        this.$partList.item(0).classList.add('on');
        this.$label.innerText = this.$partList.item(0).attributes["title"].value;
        for(let i=0; i<this.$partList.length; i++) {
            let $item = <HTMLElement>this.$partList.item(i);
            $item.onmouseenter = ()=>{
                this.moveTo(i);
            }
        }
    }
    moveTo(index:number){
        if(index < 0 || index >= this.$partList.length || index===this.partIndex) return;
        let oldIndex = this.partIndex;
        this.partIndex = index;
        let $item = this.$partList.item(index);
        let $oldItem = this.$partList.item(oldIndex);
        this.$label.innerText = $item.attributes["title"].value;
        $item.classList.add('on');
        $oldItem.classList.remove('on');
    }
}

export const isMobile = () => {
    let agent = navigator.userAgent;
    return !!agent.match(/AppleWebKit.*Mobile.*/);
};