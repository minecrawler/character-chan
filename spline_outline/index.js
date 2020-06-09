import * as wasm from "character-chan";

const instructions = wasm.face(1000);

window.instructions = instructions;

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

document.body.appendChild(canvas);
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.beginPath();
for (const inst of instructions) {
    switch (inst.action) {
        case 0: {
            ctx.bezierCurveTo(
                inst.control_point1.x, inst.control_point1.y,
                inst.control_point2.x, inst.control_point2.y,
                inst.to.x, inst.to.y,
            );
            break;
        }
        case 1: {
            ctx.lineTo(inst.to.x, inst.to.y);
            break;
        }
        case 2: {
            ctx.moveTo(inst.to.x, inst.to.y);
            break;
        }
        case 3: {
            ctx.quadraticCurveTo(
                inst.control_point1.x, inst.control_point1.y,
                inst.to.x, inst.to.y,
            );ctx.bezierCurveTo()
            break;
        }
    }
}

ctx.stroke();
