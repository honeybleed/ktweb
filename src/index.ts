import './style.scss';
const $ = require("jquery").jQuery;

let action = (log)=>{
    console.log("LOG:" ,log);
    let a = $(".logo");
    console.log(a);
};
action("hello world!");