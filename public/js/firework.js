export const max_fireworks = 2,
  max_sparks = 80;
let canvas = document.getElementById("firework-2-canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let context = canvas.getContext("2d");
let fireworks = [];
const flySound = [],
  burstSound = [];
flySound[0] = new Audio(`../firework/Rocket-Fly-By-${1}.wav`);
flySound[1] = new Audio(`../firework/Rocket-Fly-By-${2}.wav`);
flySound[2] = new Audio(`../firework/Rocket-Fly-By-${3}.wav`);
burstSound[0] = new Audio(`../firework/Mortar-Burst-${1}.wav`);
burstSound[1] = new Audio(`../firework/Mortar-Burst-${2}.wav`);
burstSound[2] = new Audio(`../firework/Mortar-Burst-${3}.wav`);
burstSound[3] = new Audio(`../firework/Mortar-Burst-${4}.wav`);
export function happynewyear() {
  for (let i = 0; i < max_fireworks; i++) {
    let firework = {
      sparks: [],
    };
    for (let n = 0; n < max_sparks; n++) {
      let spark = {
        vx: Math.random() * 5 + 0.5,
        vy: Math.random() * 5 + 0.5,
        weight: Math.random() * 0.3 + 0.03,
        red: Math.floor(Math.random() * 2),
        green: Math.floor(Math.random() * 2),
        blue: Math.floor(Math.random() * 2),
      };
      if (Math.random() > 0.5) spark.vx = -spark.vx;
      if (Math.random() > 0.5) spark.vy = -spark.vy;
      firework.sparks.push(spark);
    }
    fireworks.push(firework);
    resetFirework(firework);
  }
  window.requestAnimationFrame(explode);
}

function resetFirework(firework) {
  firework.x = Math.floor(Math.random() * canvas.width);
  firework.y = canvas.height;
  firework.age = 0;
  firework.phase = "fly";
}
function explode() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach((firework, index) => {
    if (firework.phase == "explode") {
      firework.sparks.forEach((spark) => {
        for (let i = 0; i < 10; i++) {
          let trailAge = firework.age + i;
          let x = firework.x + spark.vx * trailAge;
          let y =
            firework.y +
            spark.vy * trailAge +
            spark.weight * trailAge * spark.weight * trailAge;
          let fade = i * 20 - firework.age * 2;
          let r = Math.floor(spark.red * fade);
          let g = Math.floor(spark.green * fade);
          let b = Math.floor(spark.blue * fade);
          context.beginPath();
          context.fillStyle = "rgba(" + r + "," + g + "," + b + ",1)";
          context.rect(x, y, 2, 2);
          context.fill();
        }
      });
      firework.age++;
      if (firework.age > 100 && Math.random() < 0.05) {
        resetFirework(firework);
        let randomSoundFly = Math.floor(Math.random() * 2);
        let sound = flySound[randomSoundFly].cloneNode(false);
        sound.play();
      }
    } else {
      firework.y = firework.y - 10;
      for (let spark = 0; spark < 15; spark++) {
        context.beginPath();
        context.fillStyle = "rgba(" + index * 50 + "," + spark * 17 + ",0,1)";
        context.rect(
          firework.x + Math.random() * spark - spark / 2,
          firework.y + spark * 4,
          4,
          4
        );
        context.fill();
      }
      if (Math.random() < 0.001 || firework.y < 200) {
        firework.phase = "explode";
        let randomBurstSound = Math.floor(Math.random() * 3);
        let sound = burstSound[randomBurstSound].cloneNode(false);
        sound.play();
      }
    }
  });
  window.requestAnimationFrame(explode);
}
