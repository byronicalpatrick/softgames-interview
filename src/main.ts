import * as PIXI from "pixi.js";

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
    aceOfShadows.visible = true;
    menu.visible = false;
  });
  aceOfShadowsButton.x = app.screen.width / 2;
  aceOfShadowsButton.y = app.screen.height / 2 - 200;
  const magicWordsButton = createButton(() => {});
  magicWordsButton.x = app.screen.width / 2;
  magicWordsButton.y = app.screen.height / 2;
  const phoenixFlameButton = createButton(() => {});
  phoenixFlameButton.x = app.screen.width / 2;
  phoenixFlameButton.y = app.screen.height / 2 + 200;

  menu.addChild(aceOfShadowsButton);
  menu.addChild(magicWordsButton);
  menu.addChild(phoenixFlameButton);
  app.stage.addChild(menu);

  // TODO: better way of scaling?
  const aceOfShadows = new PIXI.Container();
  const aceOfShadowsBackground = new PIXI.Graphics();
  aceOfShadowsBackground.beginFill(0xffffff);
  aceOfShadowsBackground.drawRect(0, 0, app.screen.width, app.screen.height);
  aceOfShadowsBackground.endFill();
  aceOfShadows.addChild(aceOfShadowsBackground);
  aceOfShadows.visible = false;
  app.stage.addChild(aceOfShadows);

  // Ensure this is rendered on top
  const fpsDisplay = new PIXI.BitmapText("", {
    fontName: "Desyrel",
    fontSize: 20,
    align: "left",
  });
  fpsDisplay.x = 10;
  fpsDisplay.y = 10;
  app.stage.addChild(fpsDisplay);

  app.ticker.add((delta) => {
    // TODO: handle screen resize font issue
    // TODO: display is choppy for 1+ decimal places. Either debounce or leave as integer.
    fpsDisplay.text = app.ticker.FPS.toFixed(0);
  });
})();
