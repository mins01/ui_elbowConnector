class ElbowConnector{
  static debug = false
  static addEventListener(el){
    el.addEventListener('resize',(evnet)=>{
      this.syncAll();
    })
    el.addEventListener('load',(evnet)=>{
      this.syncAll();
    },{once:true})
  }
  static syncAll(){
    let els = document.querySelectorAll('.elbow-connector[data-ec-from][data-ec-to]').forEach((el)=>{
      this.sync(el);
    })
  }
  static sync(ecEl){
    if(!ecEl.dataset.ecFrom){ throw new Error('Not exists data-ec-from');}
    if(!ecEl.dataset.ecTo){ throw new Error('Not exists data-ec-from');}
    const ecContainer = ecEl.closest('.elbow-connector-container');
    const ecFrom = document.querySelector(ecEl.dataset.ecFrom)
    if(!ecFrom){ console.error(ecEl); throw new Error('Not exists data-ec-from element');}
    const ecTo = document.querySelector(ecEl.dataset.ecTo)
    if(!ecTo){ console.error(ecEl); throw new Error('Not exists data-ec-to element');}
    // console.log('ecFrom',ecFrom);
    // console.log('ecTo',ecTo);
    const ecFromKnob = ecEl.dataset.ecFromKnob??"0"
    const ecToKnob = ecEl.dataset.ecToKnob??"0"

    let rectContainer = ecContainer.getBoundingClientRect();
    let rectEl = ecEl.getBoundingClientRect();
    let rectFrom = ecFrom.getBoundingClientRect();
    let rectTo = ecTo.getBoundingClientRect();
    let xyFrom = this.getXY(rectFrom,ecFromKnob);
    let xyTo = this.getXY(rectTo,ecToKnob);
    
    if(ecFromKnob=="0" || ecFromKnob == "4" || ecToKnob=="0" || ecToKnob == "4" ){
      ecEl.dataset.ecDirection = "column";
    }else if(ecFromKnob=="2" || ecFromKnob == "6" || ecToKnob=="2" || ecToKnob == "6" ){
      ecEl.dataset.ecDirection = "row";
    }else{
      ecEl.dataset.ecDirection = (Math.abs(xyFrom.x - xyTo.x) - Math.abs(xyFrom.y - xyTo.y)) >= 0?'row':'column'
    }
    
    if(xyFrom.x <= xyTo.x){ //왼쪽:xyFrom
      if(xyFrom.y <= xyTo.y){ //상단:xyFrom
        ecEl.dataset.ecVertexes = '0 2';
      }else{
        ecEl.dataset.ecVertexes = '3 1';
      }
    }else{ //왼쪽 개체:xyTo
      if(xyFrom.y <= xyTo.y){//상단:xyFrom
        ecEl.dataset.ecVertexes = '1 3';
      }else{
        ecEl.dataset.ecVertexes = '2 0';
      }
    }

    // console.log('ecContainer',ecContainer,rectContainer);
    // console.log('ecEl',ecEl,rectEl);
    // console.log('ecFrom',ecFrom,rectFrom);
    // console.log('ecTo',ecTo,rectTo);
    // console.log(ecFromKnob,xyFrom);
    // console.log(ecToKnob,xyTo);
    
    let rect = {
      top :Math.min(xyFrom.y,xyTo.y)-rectContainer.top,
      left :Math.min(xyFrom.x,xyTo.x)-rectContainer.left,
      bottom : rectContainer.bottom - Math.max(xyFrom.y,xyTo.y),
      right : rectContainer.right - Math.max(xyFrom.x,xyTo.x),
    }
    ecEl.style.setProperty('--ec-top',rect.top+'px')
    ecEl.style.setProperty('--ec-left',rect.left+'px')
    ecEl.style.setProperty('--ec-bottom',rect.bottom+'px')
    ecEl.style.setProperty('--ec-right',rect.right+'px')
    
    // console.log(rect);
  }

  static getXY(rect,pos){
    if(pos==0){ return {x:(rect.left+rect.right)/2,y:rect.top} }
    else if(pos==1){ return {x:rect.right,y:rect.top} }
    else if(pos==2){ return {x:rect.right,y:(rect.top+rect.bottom)/2} }
    else if(pos==3){ return {x:rect.right,y:rect.bottom} }
    else if(pos==4){ return {x:(rect.left+rect.right)/2,y:rect.bottom} }
    else if(pos==5){ return {x:rect.left,y:rect.bottom} }
    else if(pos==6){ return {x:rect.left,y:(rect.top+rect.bottom)/2} }
    else if(pos==7){ return {x:rect.left,y:rect.top} }
    return {x:null,y:null}
  }
}

// export default ElbowConnector;