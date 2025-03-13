import * as PIXI from "pixi.js";

import aceOfShadowsCards from "./aceOfShadowsCards.json";

export default async function aceOfShadows(
  app: PIXI.Application
): Promise<PIXI.Container> {
  const container = new PIXI.Container();
  const background = new PIXI.Graphics();
  background.beginFill(0xffffff);
  background.drawRect(0, 0, app.screen.width, app.screen.height);
  background.endFill();
  container.addChild(background);

  const leftCards = new PIXI.Container();
  leftCards.sortableChildren = true;
  // Randomly select 144 cards from aceOfShadowsCards
  const sprites = [...Array(144).keys()].map(() => {
    const index = Math.floor(Math.random() * aceOfShadowsCards.length);
    const sprite = PIXI.Sprite.from(aceOfShadowsCards[index]);
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.scale.x = 2;
    sprite.scale.y = 2;
    return sprite;
  });

  const deckOffsetX = 100;

  let offset = app.screen.height / 2;
  sprites.forEach((sprite, index) => {
    sprite.x = container.width / 2 - deckOffsetX;
    sprite.y = offset + index;
    leftCards.addChild(sprite);
  });
  container.addChild(leftCards);
  const rightCards = new PIXI.Container();
  container.addChild(rightCards);

  function moveCard(
    card: PIXI.DisplayObject,
    targetX: number,
    targetY: number,
    duration = 2000
  ) {
    return new Promise((resolve) => {
      let startTime = performance.now();
      let startX = card.x;
      let startY = card.y;

      function animate(time: number) {
        let elapsed = time - startTime;
        let t = Math.min(elapsed / duration, 1);

        card.x = startX + (targetX - startX) * t;
        card.y = startY + (targetY - startY) * t;

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve(undefined);
        }
      }
      requestAnimationFrame(animate);
    });
  }

  let index = leftCards.children.length - 1;
  async function transferCard() {
    const card = leftCards.children[index];
    card.zIndex = leftCards.children.length - index;
    index -= 1;
    await moveCard(
      card,
      card.x + deckOffsetX * 2,
      app.screen.height / 2 + card.zIndex
    );
  }

  setInterval(transferCard, 1000);

  return container;
}
