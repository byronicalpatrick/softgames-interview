import * as PIXI from "pixi.js";

import aceOfShadows from "./aceOfShadows";
import magicWords from "./magicWords";
import phoenixFlame from "./phoenixFlame";

import "./style.css";

// TODO: Set to screen size (maybe: and resize to window automatically?)
const app = new PIXI.Application<HTMLCanvasElement>({
  backgroundColor: "#d2d2d2",
  resizeTo: window,
});

// TODO: fix screen scaling issues in full-screen
let fullScreen = false;

(async () => {
  document.body.appendChild(app.view);

  // TODO: pick a nicer font (or just switch to `Text`)
  await PIXI.Assets.load("https://pixijs.com/assets/bitmap-font/desyrel.xml");

  // TODO: in-game menu
  const menu = new PIXI.Container();

  function createButton(label: string, onClick: Function): PIXI.Sprite {
    const graphic = new PIXI.Graphics();
    graphic.beginFill(0xffffff);
    graphic.drawRect(0, 0, 200, 100);
    graphic.endFill();

    const texture = app.renderer.generateTexture(graphic);
    const buttonText = new PIXI.Text(label);
    buttonText.anchor.x = 0.5;
    buttonText.anchor.y = 0.5;
    const button = new PIXI.Sprite(texture);
    button.addChild(buttonText);
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

  // TODO: known issue here where we assume the user is already in
  // full screen when these objects are rendered. Fix here is to have
  // the render loop set the position of all the objects in question
  // relative to stage dimensions.
  const aceOfShadowsButton = createButton("Ace of Shadows", async () => {
    const aceOfShadowsContainer = await aceOfShadows(app);
    aceOfShadowsContainer.visible = true;
    app.stage.addChild(aceOfShadowsContainer);
    menuButton.on("pointerdown", (_) => {
      aceOfShadowsContainer.visible = false;
      menu.visible = true;
      aceOfShadowsContainer.removeFromParent();
      aceOfShadowsContainer.destroy();
    });
  });

  const magicWordsButton = createButton("Magic Words", async () => {
    const magicWordsContainer = await magicWords(app);
    magicWordsContainer.visible = true;
    app.stage.addChild(magicWordsContainer);
    menuButton.on("pointerdown", (_) => {
      magicWordsContainer.visible = false;
      menu.visible = true;
      magicWordsContainer.removeFromParent();
      magicWordsContainer.destroy();
    });
  });
  let phoenixFlameCallback: Function;
  const phoenixFlameButton = createButton("Phoenix Flame", async () => {
    const [phoenixFlameContainer, _phoenixFlameCallback] = await phoenixFlame(
      app
    );
    phoenixFlameCallback = _phoenixFlameCallback;
    phoenixFlameContainer.visible = true;
    app.stage.addChild(phoenixFlameContainer);
    menuButton.on("pointerdown", (_) => {
      phoenixFlameContainer.visible = false;
      menu.visible = true;
      phoenixFlameContainer.removeFromParent();
      phoenixFlameContainer.destroy();
    });
    app.stage.addChild(phoenixFlameContainer);
  });

  menu.addChild(aceOfShadowsButton);
  menu.addChild(magicWordsButton);
  menu.addChild(phoenixFlameButton);
  app.stage.addChild(menu);

  // Ensure this is rendered on top
  const fpsDisplay = new PIXI.Text("", {
    fontSize: 20,
    align: "left",
  });
  fpsDisplay.x = 10;
  fpsDisplay.y = 10;
  fpsDisplay.zIndex = 100;
  app.stage.addChild(fpsDisplay);
  app.stage.sortableChildren = true;
  // TODO: add button on top right for fullscreen (switching to non-full screen)
  // and to return to the menu
  const fullScreenButton = PIXI.Sprite.from("expand.png");
  fullScreenButton.cursor = "pointer";
  fullScreenButton.eventMode = "static";
  fullScreenButton.on("pointerdown", (_) => {
    document.getElementsByTagName("canvas")[0].requestFullscreen();
    fullScreen = true;
  });
  fullScreenButton.zIndex = 100;
  const smallScreenButton = PIXI.Sprite.from("minimize.png");
  smallScreenButton.cursor = "pointer";
  smallScreenButton.eventMode = "static";
  smallScreenButton.on("pointerdown", (_) => {
    document.exitFullscreen();
    fullScreen = false;
  });
  smallScreenButton.zIndex = 100;
  const menuButton = PIXI.Sprite.from("hamburger.png");
  menuButton.cursor = "pointer";
  menuButton.eventMode = "static";
  menuButton.zIndex = 100;
  app.stage.addChild(fullScreenButton);
  app.stage.addChild(smallScreenButton);
  app.stage.addChild(menuButton);

  app.ticker.add((delta) => {
    app.stage.sortChildren();

    fullScreenButton.visible = !fullScreen;
    smallScreenButton.visible = fullScreen;

    fullScreenButton.width = 20;
    fullScreenButton.height = 20;
    fullScreenButton.x = app.screen.width - 10;
    fullScreenButton.y = 10;
    fullScreenButton.anchor.x = 1;
    smallScreenButton.width = 20;
    smallScreenButton.height = 20;
    smallScreenButton.x = app.screen.width - 10;
    smallScreenButton.y = 10;
    smallScreenButton.anchor.x = 1;
    menuButton.width = 20;
    menuButton.height = 20;
    menuButton.x = app.screen.width - 50;
    menuButton.y = 10;
    menuButton.anchor.x = 1;

    if (phoenixFlameCallback) {
      phoenixFlameCallback(delta);
    }

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
