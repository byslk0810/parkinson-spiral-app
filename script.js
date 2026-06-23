const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let drawing = false;
let points = [];

drawReferenceSpiral();

function drawReferenceSpiral(){

    const cx = 350;
    const cy = 350;

    ctx.strokeStyle = "#dfe5f2";
    ctx.lineWidth = 1.2;

    ctx.beginPath();

    for(let a=0;a<10*Math.PI;a+=0.1){

        let r = 8*a;

        let x = cx + r*Math.cos(a);
        let y = cy + r*Math.sin(a);

        if(a===0){
            ctx.moveTo(x,y);
        }else{
            ctx.lineTo(x,y);
        }
    }

    ctx.stroke();
}

canvas.addEventListener("mousedown",(e)=>{
    drawing = true;

    ctx.beginPath();
    ctx.moveTo(e.offsetX,e.offsetY);

    points.push({
        x:e.offsetX,
        y:e.offsetY,
        time:Date.now()
    });
});

canvas.addEventListener("mousemove",(e)=>{

    if(!drawing) return;

    ctx.lineWidth = 3;
    ctx.strokeStyle = "blue";

    ctx.lineTo(e.offsetX,e.offsetY);
    ctx.stroke();

    points.push({
        x:e.offsetX,
        y:e.offsetY,
        time:Date.now()
    });
});

canvas.addEventListener("mouseup",()=>{
    drawing = false;
});

function clearCanvas(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    points=[];

    drawReferenceSpiral();

    document.getElementById("riskScore").textContent="0";
    document.getElementById("deviation").textContent="--";
    document.getElementById("speed").textContent="--";
    document.getElementById("tremor").textContent="--";
    document.getElementById("level").textContent="";
}

function analyzeDrawing(){

    if(points.length < 20){
        alert("กรุณาวาดก้นหอยก่อน");
        return;
    }

    let tremor = 0;

    for(let i=2;i<points.length;i++){

        let dx1 = points[i-1].x - points[i-2].x;
        let dy1 = points[i-1].y - points[i-2].y;

        let dx2 = points[i].x - points[i-1].x;
        let dy2 = points[i].y - points[i-1].y;

        let diff = Math.abs(dx2-dx1)+Math.abs(dy2-dy1);

        if(diff > 5){
            tremor++;
        }
    }

    let tremorScore = Math.min(Math.round(tremor/5),40);

    let speedScore = Math.min(
        Math.round(points.length/20),
        30
    );

    let deviationScore = Math.min(
        Math.round(points.length/30),
        30
    );

    let risk =
        tremorScore +
        speedScore +
        deviationScore;

    if(risk>100){
        risk=100;
    }

    document.getElementById("riskScore").textContent=risk;
    document.getElementById("deviation").textContent=deviationScore;
    document.getElementById("speed").textContent=speedScore;
    document.getElementById("tremor").textContent=tremorScore;

    let level="";

    if(risk<=30){
        level="ความเสี่ยงต่ำ";
    }else if(risk<=60){
        level="ความเสี่ยงปานกลาง";
    }else{
        level="ความเสี่ยงสูง";
    }

    document.getElementById("level").textContent=level;
}