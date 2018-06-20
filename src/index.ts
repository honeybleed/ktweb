import './style.scss';
import {MouseWheelEvent} from "./mouse-wheel";
import {AppController, BikeController, isMobile, PageController} from "./utils";

let body = document.getElementsByTagName('body')[0];
let container = document.getElementById('page-container');
let main = document.getElementById('main');
let pages = document.getElementsByClassName('page');
let navs = document.getElementsByClassName('nav-item');
let slider = document.getElementById('info-slider');
let triggerGroup = document.getElementById('info-slider-trigger');
let label = document.getElementById('part-name');
let partGroup = document.getElementById('part-imgs');
let partList = partGroup.children;
let imgs = slider.children[0].children;
let descs = slider.children[1].children;
let trigs = triggerGroup.children;
let joinUS = document.getElementById('join-us');
let close = document.getElementById('close-button');
let joinWin = document.getElementById('app-qcode-mask');

let isMobileClient = isMobile();

if(isMobileClient){
    body.classList.add('mobile')
} else {
    body.classList.add('desktop');
    let pageController = new PageController(main, container, pages, navs,800, 800);
    let appController = new AppController(imgs, descs, trigs, 6000);

    new BikeController(label, partList);
    appController.loopStart();
    MouseWheelEvent( document.getElementsByTagName('body')[0], ()=>{
        pageController.pageUp();

    }, ()=>{
        pageController.pageDown();
    });
    joinUS.onclick = ()=>{
        joinWin.classList.add('show');
    };
    close.onclick = ()=>{
        joinWin.classList.remove('show');
    }
}

