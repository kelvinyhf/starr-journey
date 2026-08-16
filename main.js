// main.js
import kaplay from "./assets/libraries/kaplay.mjs";
kaplay({
  background: "#4d9564",
  canvas: document.getElementById("canvas"),
});

loadBean();
scene("bean", () => {

  const player = add([
    sprite("bean"),
    pos(center())
  ]);

  onKeyDown("up", () => {
    player.move(0, -200);
  });

  onKeyDown("right", () => {
    player.move(200, 0);
  });

  onKeyDown("down", () => {
    player.move(0, 200);
  });

  onKeyDown("left", () => {
    player.move(-200, 0);
  });
  
});
go("bean");
