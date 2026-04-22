// ─── Level metadata ──────────────────────────────────────────────────
export const LEVELS = [
  { id: 1, label: 'Level 1', ageLabel: 'Age 3',   stars: 1, description: 'One word at a time' },
  { id: 2, label: 'Level 2', ageLabel: 'Age 3–4', stars: 2, description: 'Two-word pairs'      },
  { id: 3, label: 'Level 3', ageLabel: 'Age 4',   stars: 3, description: '3-word sentences'    },
  { id: 4, label: 'Level 4', ageLabel: 'Age 4–5', stars: 4, description: '4-word sentences'    },
  { id: 5, label: 'Level 5', ageLabel: 'Age 5',   stars: 5, description: '5-word sentences'    },
  { id: 6, label: 'Level 6', ageLabel: 'Age 5–6', stars: 6, description: 'Full sentences'      },
];

// ─── Theme metadata ──────────────────────────────────────────────────
export const THEMES = [
  { id: 'dino',      label: 'Dinosaurs',   emoji: '🦕', color: '#388e3c', bg: '#e8f5e9' },
  { id: 'cars',      label: 'Cars',        emoji: '🚗', color: '#c62828', bg: '#ffebee' },
  { id: 'animals',   label: 'Animals',     emoji: '🐶', color: '#e65100', bg: '#fff3e0' },
  { id: 'firetruck', label: 'Fire Trucks', emoji: '🚒', color: '#b71c1c', bg: '#fce4ec' },
  { id: 'ocean',     label: 'Ocean',       emoji: '🐠', color: '#0277bd', bg: '#e1f5fe' },
  { id: 'farm',      label: 'Farm',        emoji: '🐄', color: '#558b2f', bg: '#f1f8e9' },
];

// Helper — builds a sentence object from a plain string
const s = (text) => ({ text, words: text.replace(/[.!?]$/, '').split(' ') });

// ─── Content: CONTENT[themeId][levelId] = sentence[] ────────────────
export const CONTENT = {

  // ── DINOSAURS ───────────────────────────────────────────────────────
  dino: {
    1: [
      s('Big'),   s('Run'),  s('Rex'),
      s('Fast'),  s('Green'), s('Eat'),
    ],
    2: [
      s('Big Rex.'),   s('Rex runs.'),  s('Dino eats.'),
      s('Run fast.'),  s('Green dino.'), s('Big feet.'),
    ],
    3: [
      s('Rex is big.'),     s('Rex can run.'),
      s('The dino eats.'),  s('Run Rex run!'),
      s('I see Rex.'),      s('Dino is green.'),
    ],
    4: [
      s('Rex is very big.'),        s('The dino can run.'),
      s('I see a green dino.'),     s('The dino has big feet.'),
      s('Rex likes to eat.'),       s('The baby dino hatched.'),
    ],
    5: [
      s('The big dino runs fast.'),      s('Rex the dino is green.'),
      s('I love my big dino toy.'),      s('The dino has a long tail.'),
      s('Rex likes to eat green leaves.'), s('The tiny egg began to crack.'),
    ],
    6: [
      s('The dinosaur lived a long long time ago.'),
      s('Rex was the biggest dinosaur of them all.'),
      s('The green dino splashed in the muddy pond.'),
      s('The baby dino hatched right out of its egg.'),
      s('Rex let out a huge roar and shook the trees.'),
      s('The little dino found a friend to play with.'),
    ],
  },

  // ── CARS ─────────────────────────────────────────────────────────────
  cars: {
    1: [
      s('Car'),   s('Red'),   s('Fast'),
      s('Go'),    s('Blue'),  s('Zoom'),
    ],
    2: [
      s('Red car.'),   s('Go fast.'),  s('Blue car.'),
      s('Cars zoom.'), s('Big truck.'), s('Beep beep.'),
    ],
    3: [
      s('The car is red.'),   s('Go car go!'),
      s('I see a car.'),      s('Cars go fast.'),
      s('The truck is big.'), s('Beep beep beep!'),
    ],
    4: [
      s('The red car goes fast.'),    s('I see a big blue car.'),
      s('The truck is very loud.'),   s('I like the red race car.'),
      s('The car went up the hill.'), s('Zoom goes the fast car.'),
    ],
    5: [
      s('The fast red car zoomed by.'),       s('I love to ride in the car.'),
      s('The blue car stopped at the light.'), s('The big truck went down the road.'),
      s('My toy car is red and fast.'),        s('The race car went around the track.'),
    ],
    6: [
      s('The red car drove down the long winding road.'),
      s('I watched the race cars zoom past the finish line.'),
      s('The big blue truck beeped as it backed up slowly.'),
      s('My dad and I washed the car on a sunny day.'),
      s('The little yellow car beeped hello to all its friends.'),
      s('The fire truck and the race car raced down the road.'),
    ],
  },

  // ── ANIMALS ──────────────────────────────────────────────────────────
  animals: {
    1: [
      s('Cat'),   s('Dog'),  s('Hop'),
      s('Run'),   s('Big'),  s('Bark'),
    ],
    2: [
      s('Big dog.'),   s('Cat hops.'),  s('Dog barks.'),
      s('Bird sings.'), s('Fish swims.'), s('Bunny hops.'),
    ],
    3: [
      s('The dog runs.'),    s('I see a cat.'),
      s('The bird sings.'),  s('Big dog barks.'),
      s('The frog hops.'),   s('My cat purrs.'),
    ],
    4: [
      s('The dog can run fast.'),     s('The cat sits on the mat.'),
      s('The bird has a red wing.'),  s('My dog likes to play fetch.'),
      s('The bunny has soft fur.'),   s('The frog jumped in the pond.'),
    ],
    5: [
      s('The big brown dog ran so fast.'),    s('My cat likes to sit by the window.'),
      s('The little bird sang a sweet song.'), s('The bunny hopped all the way home.'),
      s('The puppy wagged its fluffy tail.'),  s('Two frogs jumped into the cool pond.'),
    ],
    6: [
      s('The little puppy wagged its tail when it saw me.'),
      s('The cat jumped up onto the warm sunny windowsill.'),
      s('The big brown dog ran all the way to the park and back.'),
      s('A tiny blue bird sang the sweetest song from the tall tree.'),
      s('The rabbit hopped through the garden eating all the carrots.'),
      s('My dog and my cat became the very best of friends.'),
    ],
  },

  // ── FIRE TRUCKS ───────────────────────────────────────────────────────
  firetruck: {
    1: [
      s('Red'),   s('Loud'),  s('Fast'),
      s('Bell'),  s('Help'),  s('Hose'),
    ],
    2: [
      s('Red truck.'),  s('Go fast.'),   s('Loud bell.'),
      s('Big hose.'),   s('Help us.'),   s('Beep beep.'),
    ],
    3: [
      s('The truck is red.'),    s('It rings loud.'),
      s('Go truck go!'),         s('Big red truck.'),
      s('The hose sprays.'),     s('The bell rings.'),
    ],
    4: [
      s('The big red truck goes.'),      s('The fire truck rings its bell.'),
      s('The hose puts out the fire.'),  s('The truck goes very fast.'),
      s('I see a big fire truck.'),      s('The fire truck helps us.'),
    ],
    5: [
      s('The fire truck went down the road.'),  s('The big red fire truck rang its bell.'),
      s('The firefighters put out the fire.'),  s('The long hose sprayed lots of water.'),
      s('The fire truck raced to help people.'), s('I waved at the big red fire truck.'),
    ],
    6: [
      s('The brave firefighters put out the big fire quickly.'),
      s('The loud fire truck raced down the busy street to help.'),
      s('The firefighter climbed the tall ladder to rescue the cat.'),
      s('The shiny red fire truck turned on its bright flashing lights.'),
      s('All the children waved as the fire truck drove slowly by.'),
      s('The firefighters filled the big hose with cold water from the hydrant.'),
    ],
  },

  // ── OCEAN ──────────────────────────────────────────────────────────────
  ocean: {
    1: [
      s('Fish'),  s('Blue'),  s('Wave'),
      s('Swim'),  s('Wet'),   s('Deep'),
    ],
    2: [
      s('Blue fish.'),  s('Fish swims.'),  s('Big wave.'),
      s('Swim fast.'),  s('Wet sand.'),    s('Deep blue.'),
    ],
    3: [
      s('The fish swims.'),    s('I see a fish.'),
      s('Big blue wave.'),     s('The crab walks.'),
      s('Shells on sand.'),    s('The whale blows.'),
    ],
    4: [
      s('The blue fish swims fast.'),   s('I see a big fish swim.'),
      s('The crab walks on the sand.'), s('The big whale splashes loud.'),
      s('I love the deep blue sea.'),   s('The waves crash on the shore.'),
    ],
    5: [
      s('The big blue fish swam in the sea.'),    s('I love to watch the waves crash hard.'),
      s('The little crab ran across the sand.'),  s('The starfish sat still on the wet rock.'),
      s('The big whale swam up to say hello.'),   s('I found a pretty shell on the soft sand.'),
    ],
    6: [
      s('The little fish swam between the colorful coral reef.'),
      s('The waves crashed loudly on the big wide sandy beach.'),
      s('The sea turtle swam slowly through the warm blue water.'),
      s('I picked up a shiny pink shell and held it to my ear.'),
      s('The dolphins jumped high out of the sparkling blue ocean.'),
      s('The big whale sang a long slow song deep in the dark sea.'),
    ],
  },

  // ── FARM ───────────────────────────────────────────────────────────────
  farm: {
    1: [
      s('Cow'),  s('Pig'),   s('Hen'),
      s('Moo'),  s('Oink'),  s('Egg'),
    ],
    2: [
      s('Cow moos.'),  s('Pig oinks.'),  s('Hen clucks.'),
      s('Dog barks.'), s('Big barn.'),   s('Fresh egg.'),
    ],
    3: [
      s('The cow says moo.'),   s('I see a pig.'),
      s('The hen lays eggs.'),  s('Big red barn.'),
      s('The horse runs.'),     s('Ducks go quack.'),
    ],
    4: [
      s('The brown cow says moo.'),    s('I see a big red barn.'),
      s('The hen sat on her eggs.'),   s('The horse ran in the field.'),
      s('The pig rolled in the mud.'), s('The farmer fed the animals.'),
    ],
    5: [
      s('The cow ate the green grass all day.'),  s('The little chick came out of its shell.'),
      s('The farmer woke up very early today.'),  s('The big red barn stood tall on the hill.'),
      s('The sheep had the softest fluffiest wool.'), s('Three little pigs played in the warm mud.'),
    ],
    6: [
      s('The farmer woke up early to feed all the animals.'),
      s('The old red barn stood tall in the middle of the farm.'),
      s('The baby chicks followed their mother all around the yard.'),
      s('The horse galloped fast across the wide open green field.'),
      s('The cow gave fresh warm milk to the farmer every morning.'),
      s('All the animals on the farm made noise as the sun came up.'),
    ],
  },
};
