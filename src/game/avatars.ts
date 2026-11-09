import { Avatar } from './types';

export const AVATARS: Avatar[] = [
  {
    id: 'clucky',
    name: 'Clucky the Chicken',
    tagline: 'The Legendary Road Crosser',
    emoji: '🐔',
    accentColor: '#FACC15', // Vibrant yellow
    secondaryColor: '#EF4444', // Red comb
    description: 'The brave pioneer of road crossing! Feather-light and quick on his talons.',
  },
  {
    id: 'ribbit',
    name: 'Ribbit the Frog',
    tagline: 'Leap Year Champion',
    emoji: '🐸',
    accentColor: '#22C55E', // Frog green
    secondaryColor: '#15803D',
    description: 'Spring-loaded hops make skipping across busy lanes a total breeze.',
  },
  {
    id: 'whiskers',
    name: 'Whiskers the Cat',
    tagline: 'Nine Lives Enthusiast',
    emoji: '🐱',
    accentColor: '#FB923C', // Ginger orange
    secondaryColor: '#FFFFFF',
    description: 'Nimble paws, feline reflexes, and always lands squarely on the pavement.',
  },
  {
    id: 'barky',
    name: 'Barky the Pup',
    tagline: 'Good Boy on the Go',
    emoji: '🐶',
    accentColor: '#F59E0B', // Golden caramel
    secondaryColor: '#B45309',
    description: 'Chasing tennis balls and dodging bumper cars with joyful tail wags.',
  },
  {
    id: 'shelly',
    name: 'Shelly the Turtle',
    tagline: 'Slow & Steady Racer',
    emoji: '🐢',
    accentColor: '#10B981', // Jade green
    secondaryColor: '#047857',
    description: 'Equipped with a sturdy shell, proof that careful timing beats rushing.',
  },
  {
    id: 'beep',
    name: 'Beep the Bot',
    tagline: 'Autonomous Crosser v2.0',
    emoji: '🤖',
    accentColor: '#06B6D4', // Cyan tech
    secondaryColor: '#3B82F6',
    description: 'Calculates the optimal crossing trajectory with high-precision radar sensors.',
  },
  {
    id: 'dash',
    name: 'Dash the Superkid',
    tagline: 'Caped Sidewalk Hero',
    emoji: '🦸',
    accentColor: '#EF4444', // Hero crimson
    secondaryColor: '#FBBF24',
    description: 'Flies across crosswalks with a flowing superhero cape and boundless courage.',
  },
  {
    id: 'zog',
    name: 'Zog the Alien',
    tagline: 'Intergalactic Pedestrian',
    emoji: '👾',
    accentColor: '#A855F7', // Cosmic purple
    secondaryColor: '#EC4899',
    description: 'Traveled 4 light-years just to experience Earth rush hour traffic.',
  },
  {
    id: 'hops',
    name: 'Hops the Bunny',
    tagline: 'Pavement Speedster',
    emoji: '🐰',
    accentColor: '#F472B6', // Fluffy pink/white
    secondaryColor: '#FDF2F8',
    description: 'Bounces with twitchy ears and lightning-fast zig-zag hops.',
  },
  {
    id: 'quackers',
    name: 'Quackers the Duck',
    tagline: 'Captain Crosswalk',
    emoji: '🦆',
    accentColor: '#38BDF8', // Sky blue / yellow beak
    secondaryColor: '#F59E0B',
    description: 'Waddles with swagger and never lets speeding sedans ruffle its feathers.',
  },
];

export const DEFAULT_AVATAR = AVATARS[0]; // Clucky
