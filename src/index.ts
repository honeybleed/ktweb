import './style.scss';
import {MouseWheelEvent} from "./mouse-wheel";
import {PageController} from "./utils";

let container = document.getElementById('page-container');
let main = document.getElementById('main');
let pages = document.getElementsByClassName('page');
let navs = document.getElementsByClassName('nav-item');
let pageController = new PageController(main, container, pages, navs,800, 800);

MouseWheelEvent( document.getElementsByTagName('body')[0], ()=>{
    pageController.pageUp();

}, ()=>{
    pageController.pageDown();
});
