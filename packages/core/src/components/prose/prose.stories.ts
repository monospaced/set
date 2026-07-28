import { processMarkdown } from "@monospaced/set-markdown";

import { specToArgTypes, specToComponentDescription } from "../../spec";
import { renderSetProse, SET_PROSE_SPEC, type SetProseProps } from "./prose";

const baseArgTypes = specToArgTypes(SET_PROSE_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_PROSE_SPEC),
      },
    },
    padding: "4.2rem 3rem",
  },
  title: "Typographic/Prose",
};

export default meta;

const markdown = `# An \`h1\` heading

This is a paragraph, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.

_Emphasis_, \`code\`, ~~deleted~~,  and **bold**.

Here's a link to [a website](https://monospaced.com), to a [local
doc](/), and to a [section heading in the current
doc](#an-h2-heading). Here's a footnote [^1] and another one [^2]. And an autolink literal www.monospaced.com.

[^1]: Footnote text goes here.
[^2]: Another footnote

Colour chips are supported \`#ff6aff\`

## An \`h2\` heading

> One more attribute the modern typographer must have: the capacity for taking great pains with seemingly unimportant detail. To him, one typographical point must be as important as one inch, and he must harden his heart against the accusation of being too&nbsp;fussy.

[Hans P. Schmoller](http://www.germandesigners.net/designers/hans_peter_schmoller), in _Book Design Today_, _Printing Review_, Spring 1951

### An \`h3\` heading

Itemised lists look like

- this one
- that one
- the other one

Here's a numbered list

1.  first item
2.  second item
3.  third item

Now a nested list

1. First, get these ingredients
   - carrots
   - celery
   - lentils
2. Boil some water.
3. Dump everything in the pot

    Do not bump wooden spoon or it will fall

#### An \`h4\` heading

Here's some code samples

\`\`\`
define foo() {
  print "bar";
}
\`\`\`

\`\`\`js
/* JavaScript */

console.log("oO0 iIlL1 g9qCGQ ~-+=>->");

function updateGutters(cm) {
  var gutters = cm.display.gutters,
      specs = cm.options.gutters;

  removeChildren(gutters);

  for (var i = 0; i < specs.length; ++i) {
    var gutterClass = specs[i];
    var gElt = gutters.appendChild(
      elt(
        "div",
        null,
        "CodeMirror-gutter " + gutterClass
      )
    );
    if (gutterClass == "CodeMirror-linenumbers") {
      cm.display.lineGutter = gElt;
      gElt.style.width = (cm.display.lineNumWidth || 1) + "px";
    }
  }
  gutters.style.display = i ? "" : "none";
  updateGutterSpace(cm);

  return false;
}
const total = price * quantity + tax;
\`\`\`

##### An \`h5\` heading

Images can be specified like so

![Monospaced](https://res.cloudinary.com/crvq1oh0/image/upload/f_auto,q_auto,w_640,h_360,c_fill/v1784929204/bg-brand_rprgky.png)

A horizontal rule follows.

---

###### An \`h6\` heading

Tables look like this

| Tables        |      Are       |  Cool |
| :------------ | :------------: | ----: |
| col 2 is      | centre-aligned |   £12 |
| col 3 is      | right-aligned  | £1600 |
| zebra stripes |    are neat    |    £1 |

Hamburgefonstiv

---

1. ## First \`h2\` item
   A short paragraph introducing the first item.
   - A related bullet

     - A nested bullet
     - Another nested bullet
   - Another bullet
   1. A nested numbered point
   1. Another numbered point

   A closing paragraph with a bit more detail.

1. ## Second \`h2\` item
   Another paragraph to set the scene.
   - Bullet one
   - Bullet two
   1. Step one
   1. Step two
   1. Step three

   Final paragraph to wrap up this item.

## Smaller ideas

1. ### First \`h3\` item
   A quick paragraph for the smaller section.
   - A short bullet
   - Another bullet
   1. First sub-step
   1. Second sub-step

   Closing line for this item.

1. ### Second \`h3\` item
   Intro paragraph for the second \`h3\`.
   - One bullet
   - Two bullet
   1. Alpha
   1. Beta
   1. Gamma

   Final paragraph to finish.
`;

export const Default = {
  args: {
    align: "start",
    hangingPunctuation: undefined,
    id: "",
    measured: true,
    responsive: false,
    children: processMarkdown(markdown),
  } satisfies SetProseProps,
  render: (args: SetProseProps) => renderSetProse({ ...args }),
};
