/**
 * Built with Set page metadata and content, available as
 * `data["built-with-set"].*`.
 */

export interface OneShot {
  /** Alt text for the screenshot. */
  alt: string;
  /** The mode it was built in; links to that mode's skill page. */
  mode: "strict" | "loose" | "free";
  name: string;
  /** A qualifier on the mode, such as "drawn graphic only". */
  note?: string;
  /** Folder under `src/built-with-set/`. */
  slug: string;
  /** Screenshot, 16:9 at 1440 wide. */
  src: string;
}

/** The body up to the experiments, as markdown. The figures follow it. */
const body = `## In production

- [This site](/): Set's own documentation.
- [Monospaced](https://monospaced.com): consultancy website.
- [Screen](https://screen.monospaced.com): Monospaced's brand image tool.

## Design experiments
`;

const oneShots: OneShot[] = [
  {
    alt: "The Holm overview: a neighbourhood battery co-op's dashboard, with the battery's charge, a 24-hour chart of solar and demand, and panels for your share, selling back and preferences.",
    mode: "strict",
    name: "Holm",
    slug: "holm",
    src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1795785803/holm--16x9--1440--dark.png",
  },
  {
    alt: "The Antipode landing page: the headline Every write lands twice beside a globe drawn in dots, with mirror pairs joined by dotted lines, on a dark ground.",
    mode: "loose",
    name: "Antipode",
    slug: "antipode",
    src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1795785802/antipode--16x9--1440--dark.png",
  },
  {
    alt: "The Clack library: a flip-dot board spelling the name above the heading Loops for a board, with a yellow tray for sending a rotation to the board.",
    mode: "free",
    name: "Clack",
    slug: "clack",
    src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1795785802/clack--16x9--1440--dark.png",
  },
  {
    alt: "The Overprint programme: the name set huge, the date and venue below, and a halftone disc rising from the bottom edge.",
    mode: "free",
    name: "Overprint",
    note: "drawn graphic only",
    slug: "overprint",
    src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1795785804/overprint--16x9--1440--dark.png",
  },
];

export default {
  body,
  oneShots,
  strapline: "The system in use, from production work to design experiments.",
  title: "Built with Set",
} as const;

export type BuiltWithSetData = typeof import("./built-with-set").default;
