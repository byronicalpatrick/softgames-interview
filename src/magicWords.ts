import * as PIXI from "pixi.js";

import magicWordsAPI from "./magicWordsAPI.json";

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export default async function magicWords(
  app: PIXI.Application
): Promise<PIXI.Container> {
  // TODO: fix URL fetch issue
  await PIXI.Assets.load([
    ...magicWordsAPI["emojies"].map((entry: { name: string; url: string }) => ({
      name: entry.name,
      src: entry.url,
    })),
    ...magicWordsAPI["avatars"].map((entry: { name: string; url: string }) => ({
      name: entry.name,
      src: entry.url,
    })),
  ]);

  const avatarsMap = Object.fromEntries(
    magicWordsAPI.avatars.map(
      (entry: { name: string; url: string; position: string }) => [
        entry.name,
        { src: entry.url, position: entry.position },
      ]
    )
  );

  const container = new PIXI.Container();

  const background = new PIXI.Graphics();
  background.beginFill(0xffffff);
  background.drawRect(0, 0, app.screen.width, app.screen.height);
  background.endFill();
  container.addChild(background);
  container.visible = false;

  const dialogueContainer = new PIXI.Container();
  container.eventMode = "static";
  container.addEventListener("wheel", (event) => {
    dialogueContainer.y -= event.deltaY;
  });
  container.addChild(dialogueContainer);

  // TODO: add bubble around text
  let yOffset = 50;
  for (const entry of magicWordsAPI.dialogue) {
    const dialogueBox = new PIXI.Container();
    const avatarMeta = avatarsMap[entry.name];
    const avatar = PIXI.Sprite.from(avatarMeta.src);
    avatar.anchor.y = 0.5;
    avatar.scale.x = 0.4;
    avatar.scale.y = 0.4;

    let offset = 0;
    if (avatarMeta.position === "left") {
      dialogueBox.addChild(avatar);
      offset = avatar.x + avatar.width;
    }

    // Regex splitter
    const regex = /\{(.*?)\}/g;
    const matches = [...entry.text.matchAll(regex)];
    const parts = entry.text.split(/\{.*?\}/);

    parts.forEach((part, index) => {
      const text = new PIXI.Text(part);
      text.x = offset;
      text.style.fontSize = Math.min(20, app.screen.width / 45);
      dialogueBox.addChild(text);
      offset = text.x + text.width;

      const match = matches[index];
      if (match) {
        // TODO: handle missing assets
        const image = PIXI.Sprite.from(match[1]);
        image.scale.x = isMobile ? 0.1 : 0.2;
        image.scale.y = isMobile ? 0.1 : 0.2;
        image.x = offset;
        offset = image.x + image.width;
        dialogueBox.addChild(image);
      }
    });

    if (avatarMeta.position === "right") {
      avatar.x = offset;
      dialogueBox.x = container.width - (dialogueBox.width + avatar.width);
      dialogueBox.addChild(avatar);
    }

    dialogueBox.y = yOffset;
    yOffset = dialogueBox.y + dialogueBox.height;
    dialogueContainer.addChild(dialogueBox);
  }

  return container;
}
