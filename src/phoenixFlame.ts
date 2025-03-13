import * as PIXI from "pixi.js";

const maxParticles = 10;

interface Particle {
  x: number;
  y: number;
  fade: number;
}

export default async function phoenixFlame(
  app: PIXI.Application
): Promise<[PIXI.Container, Function]> {
  const container = new PIXI.Container();
  const background = new PIXI.Graphics();
  background.beginFill(0xffffff);
  background.drawRect(0, 0, app.screen.width, app.screen.height);
  background.endFill();
  container.addChild(background);
  container.visible = false;

  const sprites = new PIXI.ParticleContainer(10, {
    scale: true,
    position: true,
    rotation: true,
    uvs: true,
    alpha: true,
  });
  container.addChild(sprites);

  const particles: Particle[] = [];

  function createParticle() {
    const sparkGraphics = new PIXI.Graphics();
    sparkGraphics.beginFill("#af1717");
    sparkGraphics.drawCircle(0, 0, 10);
    sparkGraphics.endFill();

    const texture = app.renderer.generateTexture(sparkGraphics);
    const sprite = new PIXI.Sprite(texture);
    sprite.width = 50;
    sprite.height = 50;
    sprite.anchor.set(0.5);
    sprite.x = app.screen.width / 2;
    sprite.y = app.screen.height / 2;
    sprite.alpha = 1;
    sprite.scale.set(0.5 + Math.random() * 0.5);

    particles.push({
      x: Math.random() * 2 - 1,
      y: -Math.random() * 2 - 2,
      fade: Math.random() * 0.02 + 0.01,
    });
    sprites.addChild(sprite);
  }

  function updateParticles(delta: number) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const sprite = sprites.children[i];
      const p = particles[i];
      sprite.x += p.x;
      sprite.y += p.y;
      sprite.alpha -= p.fade;
      sprite.scale.x *= 0.95;
      sprite.scale.y *= 0.95;

      if (sprite.alpha <= 0) {
        sprites.removeChild(sprite);
        particles.splice(i, 1);
      }
    }
  }

  return [
    container,
    function (delta: number) {
      if (particles.length < maxParticles) {
        createParticle();
      }
      updateParticles(delta);
    },
  ];
}
