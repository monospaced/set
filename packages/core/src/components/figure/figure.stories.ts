import { specToArgTypes, specToComponentDescription } from "../../spec";
import { renderSetImage } from "../image/image";
import { renderSetProse } from "../prose/prose";
import {
  renderSetFigure,
  SET_FIGURE_SPEC,
  type SetFigureProps,
} from "./figure";

const baseArgTypes = specToArgTypes(SET_FIGURE_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_FIGURE_SPEC),
      },
    },
  },
  title: "Structure/Figure",
};

export default meta;

export const Default = {
  args: {
    align: "start",
    caption:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    children: renderSetImage({
      alt: "Monospaced card artwork",
      radius: true,
      shadow: true,
      src: "https://res.cloudinary.com/monospaced/image/upload/w_640,h_480,c_fill/v1787268747/2018-04-20_15.28.26--cyan--mid_xk9pul.png",
    }),
    id: "",
    responsive: false,
  } satisfies SetFigureProps,
  render: (args: SetFigureProps) => renderSetFigure(args),
};

export const Code = {
  args: {
    caption:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    children: renderSetProse({
      children: `<pre><code class="language-js" tabIndex="0"><span class="hljs-comment">/* JavaScript */</span>

<span class="hljs-variable">console</span>.<span class="hljs-title">log</span>(<span class="hljs-string">"oO0 iIlL1 g9qCGQ ~-+=&gt;-&gt;"</span>);

<span class="hljs-keyword">function</span> <span class="hljs-title">updateGutters</span>(<span class="hljs-params">cm</span>) {
  <span class="hljs-keyword">var</span> gutters = cm.<span class="hljs-property">display</span>.<span class="hljs-property">gutters</span>,
      specs = cm.<span class="hljs-property">options</span>.<span class="hljs-property">gutters</span>;

  <span class="hljs-title">removeChildren</span>(gutters);

  <span class="hljs-keyword">for</span> (<span class="hljs-keyword">var</span> i = <span class="hljs-number">0</span>; i &lt; specs.<span class="hljs-property">length</span>; ++i) {
    <span class="hljs-keyword">var</span> gutterClass = specs[i];
    <span class="hljs-keyword">var</span> gElt = gutters.<span class="hljs-title">appendChild</span>(
      <span class="hljs-title">elt</span>(
        <span class="hljs-string">"div"</span>,
        <span class="hljs-literal">null</span>,
        <span class="hljs-string">"CodeMirror-gutter "</span> + gutterClass
      )
    );
    <span class="hljs-keyword">if</span> (gutterClass == <span class="hljs-string">"CodeMirror-linenumbers"</span>) {
      cm.<span class="hljs-property">display</span>.<span class="hljs-property">lineGutter</span> = gElt;
      gElt.<span class="hljs-property">style</span>.<span class="hljs-property">width</span> = (cm.<span class="hljs-property">display</span>.<span class="hljs-property">lineNumWidth</span> || <span class="hljs-number">1</span>) + <span class="hljs-string">"px"</span>;
    }
  }
  gutters.<span class="hljs-property">style</span>.<span class="hljs-property">display</span> = i ? <span class="hljs-string">""</span> : <span class="hljs-string">"none"</span>;
  <span class="hljs-title">updateGutterSpace</span>(cm);

  <span class="hljs-keyword">return</span> <span class="hljs-literal">false</span>;
}
<span class="hljs-keyword">const</span> total = price * quantity + tax;
</code></pre>`,
    }),
  } satisfies SetFigureProps,
  render: (args: SetFigureProps) => renderSetFigure(args),
};

export const Poem = {
  args: {
    caption: "<cite>This Is Just To Say</cite><br /> William Carlos Williams",
    children: renderSetProse({
      children: `<p>I have eaten<br />
      the plums<br />
      that were in<br />
      the icebox</p>
      <p>and which<br />
      you were probably<br />
      saving<br />
      for breakfast</p>
      <p>Forgive me<br />
      they were delicious<br />
      so sweet<br />
      and so cold</p><hr />`,
    }),
  } satisfies SetFigureProps,
  render: (args: SetFigureProps) => renderSetFigure(args),
};
