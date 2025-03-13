# Softgames

A limitation on this implementation is the assumption that the user remains in full-screen. To resolve this I would need to modify how the render loop handles sprite positioning.

## Ace of Shadows

I'd like to improve this one by adding a green-felt style background and some more realistic cards, plus some easing to the animation to make it nicer.

Assets downloaded from https://opengameart.org/content/playing-cards-pack

## Magic Words

There were some constraints on the API results, e.g. `https://api.dicebear.com:81/9.x/fun-emoji/png?seed=Sad` the port number in this link and `{affirmative}` not being within the `emojies` content. So I've put the cleaned payload response in `magicWordsAPI.json` and used that for now. A bit more work would be needed to use the actual API call.

## Phoenix Fire

Most of the heavy lifting here is done by the sprite animations from https://opengameart.org/content/wgstudio-fire-animation-loop, with the addition of some spark-particle effects.
