import type { SetNode } from "../../helpers/node";

// The boot animation needs the mark decomposed into addressable cells —
// structure the single-path shape tokens cannot carry. Keep the artwork in
// step with `primitive.shape.logo.*`.

const PRIMARY_VIEWBOX = "0 0 6714.6 1200";
const GRAPHIC_VIEWBOX = "0 0 600 1200";

/** Cells in boot order; logo.css keys the keyframes by nth-child. */
const MARK_CELLS: ReadonlyArray<{ x: number; y: number }> = [
  { x: 0, y: 0 },
  { x: 300, y: 0 },
  { x: 150, y: 300 },
  { x: 450, y: 300 },
  { x: 0, y: 600 },
  { x: 300, y: 600 },
  { x: 150, y: 900 },
  { x: 450, y: 900 },
];

// Verbatim copy of `primitive.shape.logo.typographic.path` (drift-guarded
// by logo.test.ts), offset into the primary lockup's space.
const WORD_PATH =
  "M0 956h98V571L87 391h2l124 320h89l123-320h3l-11 180v385h98V276H384L260 608h-5L131 276H0zm879.94 10c184 0 223-46 223-272 0-225-39-271-223-271-186 0-224 46-224 271 0 226 38 272 224 272m0-93c-102 0-123-30-123-179 0-147 21-177 123-177 100 0 121 30 121 177 0 149-21 179-121 179m361.44 83h103V686c0-141 20-169 112-169 73 0 88 18 88 107v332h103V624c0-167-28-202-163-202-95 0-120 16-147 92h-5v-82h-91zm769.16 10c184 0 223-46 223-272 0-225-39-271-223-271-186 0-224 46-224 271 0 226 38 272 224 272m0-93c-102 0-123-30-123-179 0-147 21-177 123-177 100 0 121 30 121 177 0 149-21 179-121 179m363.25-65c-4 132 30 158 202 158 173 0 208-25 208-150 0-118-33-146-191-170-94-14-114-26-114-74 0-50 18-60 103-60 76 0 92 9 96 52h97c-3-118-36-142-194-142-166 0-201 25-201 146 0 114 31 141 182 162 101 13 122 28 122 82 0 53-18 64-103 64-88 0-107-11-110-68zm558.97 363h102V902h5c20 54 41 64 123 64 160 0 193-45 193-270 0-227-34-274-198-274-83 0-105 11-123 65h-4v-55h-98zm209-298c-93 0-112-30-112-179 0-148 19-178 112-178s113 30 113 179c0 148-20 178-113 178m656.46 83h88V610c0-156-34-187-197-187-150 0-181 27-179 157h97c1-61 15-74 85-74 82 0 99 18 99 105v24h-72c-187 0-226 30-226 179 0 126 28 152 162 152 92 0 116-13 138-74h5zm-8-243c-1 135-22 163-119 163-65 0-79-13-79-75 0-74 18-88 107-88zm551.75 95c-10 56-26 67-89 67-100 0-121-31-121-181s20-181 117-181c65 0 81 14 91 79h101c-4-141-37-170-188-170-185 0-224 46-224 272s39 272 226 272c147 0 179-26 186-158zm547.03 9c-15 48-31 58-96 58-96 0-117-23-123-136h324c5-263-32-317-214-317-172 0-207 46-207 271 0 227 38 273 223 273 139 0 172-25 190-149zm-218-160c4-122 24-146 114-146 88 0 108 24 112 146zm787.56 299h93l-1-734h-102l1 266h-5c-19-54-40-65-120-65-162 0-196 46-196 272s35 271 200 271c84 0 105-11 125-65h5zm-115-82c-94 0-114-30-114-180s20-180 114-180c93 0 112 30 112 180s-19 180-112 180";
const WORD_OFFSET = 1163;

const markGroup = (): SetNode => ({
  kind: "element",
  tag: "g",
  attrs: { class: "mark" },
  children: MARK_CELLS.map(({ x, y }) => ({
    kind: "element" as const,
    tag: "rect",
    attrs: {
      height: "300",
      width: "150",
      x: String(x),
      y: String(y),
    },
    children: [],
  })),
});

const wordGroup = (): SetNode => ({
  kind: "element",
  tag: "g",
  attrs: { class: "word", transform: `translate(${WORD_OFFSET} 0)` },
  children: [
    {
      kind: "element",
      tag: "path",
      attrs: { d: WORD_PATH },
      children: [],
    },
  ],
});

const animatedSvg = (viewBox: string, children: SetNode[]): SetNode => ({
  kind: "element",
  tag: "svg",
  attrs: {
    "aria-hidden": "true",
    viewBox,
    xmlns: "http://www.w3.org/2000/svg",
  },
  children,
});

/** Builds the animated primary logo SVG (mark plus wordmark). */
export function buildSetLogoAnimatedPrimary(): SetNode {
  return animatedSvg(PRIMARY_VIEWBOX, [markGroup(), wordGroup()]);
}

/** Builds the animated graphic logo SVG (mark only). */
export function buildSetLogoAnimatedGraphic(): SetNode {
  return animatedSvg(GRAPHIC_VIEWBOX, [markGroup()]);
}
