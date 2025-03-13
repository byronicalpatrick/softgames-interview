import * as PIXI from "pixi.js";

import aceOfShadows from "./aceOfShadows";
import magicWords from "./magicWords";

import "./style.css";

// TODO: Set to screen size (maybe: and resize to window automatically?)
const app = new PIXI.Application<HTMLCanvasElement>({
  backgroundColor: "#d2d2d2",
  resizeTo: window,
});

// TODO: in-game menu
// TODO: run in full-screen

(async () => {
  document.body.appendChild(app.view);
  // TODO: add fullscreen icon
  // document.getElementsByTagName("canvas")[0].requestFullscreen();

  // TODO: pick a nicer font (or just switch to `Text`)
  await PIXI.Assets.load("https://pixijs.com/assets/bitmap-font/desyrel.xml");

  // TODO: in-game menu
  const menu = new PIXI.Container();

  function createButton(onClick: Function): PIXI.Sprite {
    const graphic = new PIXI.Graphics();
    graphic.beginFill(0xffffff);
    graphic.drawRect(0, 0, 200, 100);
    graphic.endFill();

    const texture = app.renderer.generateTexture(graphic);
    const button = new PIXI.Sprite(texture);
    // TODO: update state to display new page
    button.on("pointerdown", (_) => {
      onClick();
    });
    button.cursor = "pointer";
    button.eventMode = "static";
    button.anchor.x = 0.5;
    button.anchor.y = 0.5;

    return button;
  }

  // TODO: bind escape key to switch for menu
  const aceOfShadowsButton = createButton(() => {
    aceOfShadowsContainer.visible = true;
    menu.visible = false;
  });

  const magicWordsButton = createButton(() => {
    magicWordsContainer.visible = true;
    menu.visible = false;
  });
  const phoenixFlameButton = createButton(() => {});

  menu.addChild(aceOfShadowsButton);
  menu.addChild(magicWordsButton);
  menu.addChild(phoenixFlameButton);
  app.stage.addChild(menu);

  // TODO: better way of scaling?
  const aceOfShadowsContainer = await aceOfShadows(app);
  aceOfShadowsContainer.visible = false;
  app.stage.addChild(aceOfShadowsContainer);

  const magicWordsContainer = await magicWords(app);
  app.stage.addChild(magicWordsContainer);

  // Ensure this is rendered on top
  const fpsDisplay = new PIXI.BitmapText("", {
    fontName: "Desyrel",
    fontSize: 20,
    align: "left",
  });
  fpsDisplay.x = 10;
  fpsDisplay.y = 10;
  app.stage.addChild(fpsDisplay);

  // TODO: remove - debug line
  // aceOfShadowsContainer.visible = true;
  // menu.visible = false;

  app.ticker.add((delta) => {
    aceOfShadowsButton.x = app.screen.width / 2;
    aceOfShadowsButton.y = app.screen.height / 2 - 200;
    magicWordsButton.x = app.screen.width / 2;
    magicWordsButton.y = app.screen.height / 2;
    phoenixFlameButton.x = app.screen.width / 2;
    phoenixFlameButton.y = app.screen.height / 2 + 200;
    // TODO: handle screen resize font issue
    // TODO: display is choppy for 1+ decimal places. Either debounce or leave as integer.
    fpsDisplay.text = app.ticker.FPS.toFixed(0);
  });
})();
