let addEvent = (element, onScrollUp: ()=>void, onScrollDown: ()=>void) =>{
  let _eventCompat = (event) => {
      let type = event.type;
      if(type === 'DOMMouseScroll' || type === 'mousewheel') {
          event.delta = (event.wheelDelta) ? event.wheelDelta/120 : -(event.detail || 0) / 3;
      }
      if(event.srcElement && !event.target){
          event.target = event.srcElement;
      }
      if(!event.preventDefault && event.returnValue !== undefined) {
          event.preventDefault = function () {
              event.returnValue = false;
          }
      }
      return event;
  };
  if(window.addEventListener){
      let type = 'mousewheel';
      if(document['mozHidden'] !== undefined) {
          type = "DOMMouseScroll";
      }
      element.addEventListener(type, (event)=>{
          let _mwEvent = _eventCompat(event);
          if(_mwEvent.delta < 0) {
              onScrollUp();
          } else {
              onScrollDown();
          }
      }, false)
  } else if(window['attachEvent']) {
      element['attachEvent']('onmousewheel', (event)=>{
          event = event || window.event;
          let _mwEvent = _eventCompat(event);
          if(_mwEvent.delta < 0) {
              onScrollUp();
          } else {
              onScrollDown();
          }
      })
  } else {
      return;
  }
};
export const MouseWheelEvent = addEvent;