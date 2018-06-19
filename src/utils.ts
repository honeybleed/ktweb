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