import * as PIXI from "pixi.js";

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const maxParticles = 9;

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
  });
  container.addChild(sprites);

  const particles: Particle[] = [];

  function createParticle() {
    const graphic = new PIXI.Graphics();
    graphic.beginFill("#ff3500");
    graphic.drawCircle(0, 0, 2);
    graphic.endFill();

    const circleTexture = app.renderer.generateTexture(graphic);
    const sprite = new PIXI.Sprite(circleTexture);
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
      fade: Math.random() * 0.02,
    });
    sprites.addChild(sprite);
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const sprite = sprites.children[i];
      const p = particles[i];
      sprite.x += p.x;
      sprite.y += p.y;
      sprite.scale.x *= 0.99;
      sprite.scale.y *= 0.99;

      if (sprite.y <= 0) {
        sprites.removeChild(sprite);
        particles.splice(i, 1);
      }
    }
  }

  const frames = [];
  for (let i = 0; i <= 75; i++) {
    const index = String(i + 51).padStart(4, "0");
    frames.push(PIXI.Texture.from(`fire/fire1_${index}.png`));
  }
  const fireAnimation = new PIXI.AnimatedSprite(frames);
  fireAnimation.animationSpeed = 0.9;
  fireAnimation.play();
  if (isMobile) {
    fireAnimation.width = 1;
    fireAnimation.height = 1;
  }
  fireAnimation.anchor.set(0.5);
  fireAnimation.x = app.screen.width / 2;
  fireAnimation.y = app.screen.height / 2;
  fireAnimation.alpha = 1;
  container.addChild(fireAnimation);
  return [
    container,
    function () {
      if (particles.length < maxParticles) {
        createParticle();
      }
      updateParticles();
    },
  ];
}
