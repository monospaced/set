# Design Tokens Resolver Module 2025.10

Final Community Group Report 28 October 2025

- This version:: https://www.designtokens.org/TR/2025.10/resolver/
- Latest published version:: https://www.designtokens.org/TR/2025.10/resolver/
- Editors:: Joren Broekema
- Esther Cheran
- Mike Kamminga
- Andrew L’Homme
- Drew Powers
- Matthew Ström-Awn
- Lilith Wittmann
- Authors:: Louis Chenais
- James Nash
- Feedback:: GitHub design-tokens/community-group (pull requests, new issue, open issues)
Copyright © 2025 the Contributors to the Design Tokens Resolver Module 2025.10 Specification, published by the Design Tokens Community Group under the W3C Community Final Specification Agreement (FSA). A human-readable summary is available.

---

## Abstract

This specification extends the format and describes a method to work with design tokens in multiple contexts (such as “light mode” and “dark mode” color themes).

## Status of This Document

This specification was published by the Design Tokens Community Group. It is not a W3C Standard nor is it on the W3C Standards Track. Please note that under the W3C Community Final Specification Agreement (FSA) other conditions apply. Learn more about W3C Community and Business Groups.

This section describes the status of this document at the time of its publication. Other documents may supersede this document. A list of current W3C Community Group reports and the latest revision of this report can be found in the W3C Community Group reports index at https://www.w3.org/community/reports/.

This document was published by the DTCG as a Candidate Recommendation following the definitions provided by the W3C process. Contributions to this draft are governed by Community Contributor License Agreement (CLA), as specified by the W3C Community Group Process.

While not a W3C recommendation, this classification is intended to clarify that, after extensive consensus-building, this specification is intended for implementation.

This specification is considered stable. Further updates will be provided in superseding specifications.

GitHub Issues are preferred for discussion of this specification.

## 1. Introduction

This section is non-normative.

Consumers of design tokens often need to express alternate values that apply in different contexts. Such examples include, but are not limited to:

- Theming, such as light mode, dark mode, and high contrast color modes
- Sizing, such as mobile (small), tablet (medium), desktop (large)
- Accessibility mode, such as reduced motion, colorblindness, etc.

However, these alternate contexts are susceptible to combinatorial explosion, making storage and management unwieldy.

This format describes a mechanism for deduplicating all repeat values of tokens across all contexts as well as enumerating all permutations of contexts.

## 2. Terminology

### 2.1 Orthogonality

This section is non-normative.

A trait describing two or more contexts that each operate on exclusive tokens, i.e. do not overlap. Modifiers MAY be orthogonal, but it are not required to be.

Making modifiers orthogonal as much as possible reduces cognitive load and reduces user error.

Given the following modifiers:

- A theme modifier has the values light and dark. Among its values, it provides a value for the color.button token.
- A brand modifier has the values brandA and brandB. Among its values, it provides a value for the color.button token.

Since both modifiers provide a value for the color.button token, this means array order determines the final value, i.e. non-orthogonal.

### 2.2 Permutation

A permutation is a single possible permutation of a resolver document. A permutation maps 1:1 to an input, but the term “input” emphasizes the modifier contexts used, where “permutation” emphasizes the final set of tokens.

## 3. Filetype

### 3.1 Format

A resolver document MUST use standard JSON syntax ([RFC8259]).

Tools MAY support extensions such as JSONC or JSON5 so long as the document may be converted to normal JSON without affecting token values.

### 3.2 File extension

Users SHOULD use the .resolver.json file extension to name resolver documents.

### 3.3 MIME type

When transmitting a resolver document over HTTP, users SHOULD use the expected application/json MIME type ([RFC6838]) in the Content-Type header ([RFC1341]). Users SHOULD NOT use a custom or unexpected MIME type.

## 4. Syntax

### 4.1 Root level properties

A resolver document contains the following properties at the root level:

#### 4.1.1 Name

The document MAY provide a human-readable name at the root level. This is helpful to distinguish one resolver document from another, in case the filename itself isn’t enough.

#### 4.1.2 Version

The document MUST provide a version at the root level, and it MUST be 2025.10. This is reserved for future versions in case breaking changes are introduced.

#### 4.1.3 Description

The document MAY provide a description at the root level. This may be used to add additional explanation or context not present in name.

#### 4.1.4 Sets

A set is a collection of design tokens in DTCG format. A set MUST contain a sources array with tokens declared directly, or a reference object pointing to a JSON file containing design tokens, or any combination of the two.

A set MAY include a description describing the purpose of the set.

If the array declares multiple sources, they will be merged in array order, meaning if a token is declared multiple times, the last occurrence in the array will be the final value. Tools MUST respect array ordering.

```
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/resolver.json",
  "sets": {
    "color": {
      "description": "Color tokens",
      "sources": [
        { "$ref": "base/legacy.json" },
        { "$ref": "base/foundation.json" },
        { "$ref": "base/color-ramps.json" },
        { "$ref": "base/semantic.json" }
      ]
    },
    "size": {
      "description": "Dimension, margin, and spacing tokens",
      "sources": [
        {
          "space": {
            "base": {
              "100": {
                "$type": "dimension",
                "$value": { "value": 2, "unit": "rem" }
              }
            }
          }
        }
      ]
    }
  }
}
```

#### 4.1.5 Modifiers

A modifier is similar to a set, but allows for conditional inclusion via the contexts map.

##### 4.1.5.1 Contexts

A modifier MUST declare a contexts map of a string value to an array of token sources. The array of tokens sources MUST be a ReferenceObject, inline tokens, or any combination of the two.

A modifier SHOULD have two or more contexts, since one is the equivalent of a set. A modifier MUST NOT have an empty contexts map. Tools SHOULD throw an error for modifiers with only 1 context. Tools MUST throw an error for modifiers with 0 contexts.

Like sets, array order MUST be respected such that in case of conflict, the last occurrence of a token in the array produces the final value.

A modifier MAY reference a set inside a context value. However a modifier MUST NOT reference any other modifier, not even another context inside the same modifier.

```
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/resolver.json",
  "modifiers": {
    "theme": {
      "description": "Color theme",
      "contexts": {
        "light": [{ "$ref": "theme/light.json" }],
        "lightHighContrast": [
          { "$ref": "theme/light.json" },
          { "$ref": "theme/dark-high-contrast.json" }
        ],
        "dark": [{ "$ref": "theme/dark.json" }],
        "darkHighContrast": [
          { "$ref": "theme/dark.json" },
          { "$ref": "theme/dark-high-contrast.json" }
        ]
      },
      "default": "light"
    }
  }
}
```

A modifier MAY reference a set inside a context value. This is equivalent to the sources being inlined in the same array. For example, the following:

```
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/resolver.json",
  "sets": {
    "baseSize": {
      "sources": [{ "$ref": "size/base.json" }]
    }
  },
  "modifiers": {
    "size": {
      "description": "Application size",
      "contexts": {
        "small": [
          { "$ref": "#/sets/baseSize" },
          { "$ref": "device/mobile.json" },
          { "$ref": "typography/mobile.json" }
        ],
        "medium": [
          { "$ref": "#/sets/baseSize" },
          { "$ref": "device/tablet.json" },
          { "$ref": "typography/base.json" }
        ],
        "large": [
          { "$ref": "#/sets/baseSize" },
          { "$ref": "device/desktop.json" },
          { "$ref": "typography/base.json" }
        ]
      }
    }
  }
}
```

Is equivalent to:

```
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/resolver.json",
  "sets": {
    "baseSize": {
      // …
    }
  },
  "modifiers": {
    "size": {
      "description": "Application size",
      "contexts": {
        "small": [
          { "$ref": "size/base.json" },
          { "$ref": "device/mobile.json" },
          { "$ref": "typography/mobile.json" }
        ],
        "medium": [
          { "$ref": "size/base.json" },
          { "$ref": "device/tablet.json" },
          { "$ref": "typography/base.json" }
        ],
        "large": [
          { "$ref": "size/base.json" },
          { "$ref": "device/desktop.json" },
          { "$ref": "typography/base.json" }
        ]
      }
    }
  }
}
```

##### 4.1.5.2 Description

A modifier MAY declare a human-readable description.

##### 4.1.5.3 Default

A modifier MAY declare a default value that MUST match one of the keys in contexts. Tools MUST throw an error if the value is not present in contexts.

##### 4.1.5.4 Resolution count

The number of possible resolutions a document may generate may be predicted with the product of all contexts across all modifiers.

- If a document had 2 modifiers that each had 2 contexts, that resolver may produce 4 resolutions, or 2 × 2.
- If a document had 3 modifiers with 4, 3, and 2 contexts respectively, that resolver may produce 24 resolutions, or 4 × 3 × 2.

#### 4.1.6 Resolution Order

The resolutionOrder key is an array of sets and modifiers ordered to produce the final result of tokens. The order is significant, with tokens later in the array overriding any tokens that came before them, in case of conflict.

Given a resolutionOrder that consists of multiple sets and modifiers:

```
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/resolver.json",
  "sets": {
    "size": {
      "sources": [{ "$ref": "foundation/size.json" }]
    },
    "typography": {
      "sources": [{ "$ref": "foundation/typography.json" }]
    },
    "animation": {
      "sources": [{ "$ref": "foundation/animation.json" }]
    }
  },
  "modifiers": {
    "theme": {
      "description": "Color theme",
      "contexts": {
        "light": [{ "$ref": "theme/light.json" }],
        "lightHighContrast": [
          { "$ref": "theme/light.json" },
          { "$ref": "theme/dark-high-contrast.json" }
        ],
        "dark": [{ "$ref": "theme/dark.json" }],
        "darkHighContrast": [
          { "$ref": "theme/dark.json" },
          { "$ref": "theme/dark-high-contrast.json" }
        ]
      },
      "default": "light"
    }
  },
  "resolutionOrder": [
    { "$ref": "#/sets/size" },
    { "$ref": "#/sets/typography" },
    { "$ref": "#/sets/animation" },
    { "$ref": "#/modifiers/theme" }
  ]
}
```

This merely describes multiple final results of tokens. We’ll need an input to produce the final sets.

Given the following inputs, we would get the following resolution order:

```
{ "theme": "light" }
```

- foundation/size.json
- foundation/typography.json
- foundation/animation.json
- theme/light.json

```
{ "theme": "lightHighContrast" }
```

- foundation/size.json
- foundation/typography.json
- foundation/animation.json
- theme/light.json
- theme/light-high-contrast.json

```
{ "theme": "dark" }
```

- foundation/size.json
- foundation/typography.json
- foundation/animation.json
- theme/dark.json

```
{ "theme": "darkHighContrast" }
```

- foundation/size.json
- foundation/typography.json
- foundation/animation.json
- theme/dark.json
- theme/dark-high-contrast.json

In case of any conflict, the last occurrence of a design token produces the final value.

Modifiers MAY contain empty context arrays:

```
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/resolver.json",
  "modifiers": {
    // …
    "debug": {
      "description": "Enable debug mode",
      "contexts": {
        "false": [],
        "true": [{ "$ref": "debug.json" }]
      }
    }
  },
  "resolutionOrder": [
    // …
    { "$ref": "#/modifiers/debug" }
  ]
}
```

This would then load an additional debug.json file if it received a { "debug": "true" } input.

##### 4.1.6.1 Inline sets and modifiers

In resolutionOrder, a set or modifier MAY be declared inline, so long as name and type keys are added to the object:

Tools MUST throw an error in the case where name or type are missing from an inline object, or if name is duplicated among any objects.

When sets and modifiers appear in their respective root level sets and modifiers keys, it is valid for a set to share a name with a modifier. It is only invalid to duplicate a name inside the resolutionOrder array.

```
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/resolver.json",
  "resolutionOrder": [
    {
      "type": "set",
      "name": "Size",
      "sources": [{ "$ref": "foundation/size.json" }]
    },
    {
      "type": "set",
      "name": "Typography",
      "sources": [{ "$ref": "foundation/typography.json" }]
    },
    {
      "type": "set",
      "name": "Animation",
      "sources": [{ "$ref": "#/sets/Animation" }]
    },
    {
      "type": "modifier",
      "name": "Theme",
      "description": "Color theme",
      "contexts": {
        "light": [{ "$ref": "theme/light.json" }],
        "lightHighContrast": [
          { "$ref": "theme/light.json" },
          { "$ref": "theme/dark-high-contrast.json" }
        ],
        "dark": [{ "$ref": "theme/dark.json" }],
        "darkHighContrast": [
          { "$ref": "theme/dark.json" },
          { "$ref": "theme/dark-high-contrast.json" }
        ]
      },
      "default": "light"
    }
  ]
}
```

Inline sets and modifiers MUST NOT be referenced in any way. Tools SHOULD throw an error when a reference object points to a resolution order item.

The following reference object pointer is invalid regardless of where it appears:

```
{ "$ref": "#/resolutionOrder/4" }
```

This is very likely to create an invalid reference, no matter if it appears in sets (circular dependency), modifiers (circular dependency), or in another place in the resolutionOrder array (infinite recursion). The times where this would not cause an invalid reference are rare, and the slightest change may turn it into a circular reference.

##### 4.1.6.2 Ordering of sets and modifiers

This section is non-normative.

The resolutionOrder array allows for any ordering of sets and modifiers to the user’s choosing. However, in the scenario that many sets must appear after the modifiers to resolve conflicts, it is likely a smell of unpredictable and brittle token organization. Ideally, modifiers handle conditional values so well they require few or no overrides (see orthogonality). In practical terms, this means that

### 4.2 Reference objects

When referring to another JSON document or a structure within the same document, a reference object MUST be used. This is described in JSON Schema 2020-12 as an object with a key of $ref whose string is a valid JSON pointer as described in [RFC6901].

Tools MUST resolve all reference objects in a resolver document.

Reference objects MUST NOT be circular, neither referencing other pointers that reference itself, nor referencing any parent node of the reference object.

Tools MUST support same-document reference objects, as that is the minimum requirement to support this resolver module. Beyond that, tools may make individual decisions to not support some URI types such as importing files on a local file system, or remote URIs over TCP/IP.

Common examples of reference objects include:

```
{ "$ref": "#/sets/MySet" }
```

References sets/MySet within the same document.

```
{ "$ref": "path/to/example.json" }
```

References the entire contents of ./path/to/example.json, relative to this document.

```
{ "$ref": "example.json#sets/MySet" }
```

References only a part of example.json: sets/MySet.

```
{ "$ref": "https://my-server.com/tokens.json" }
```

References a remote file hosted at a publicly-available URL.

```
{
  "foo": {
    "bar": { "$ref": "#/baz/bat" }
  },
  "baz": {
    "bat": { "$ref": "#/foo/bar" }
  }
}
```

This example is invalid because both foo/bar and baz/bat reference one another and therefore have no final value.

```
{
  "foo": {
    "bar": {
      "baz": { "$ref": "#/foo/bar" }
    }
  }
}
```

A single reference object that references its parent is invalid because it will include itself and infinitely recurse.

#### 4.2.1 Invalid pointers

A pointer MAY point anywhere within the same document, with the exception of the following:

- Only resolutionOrder may reference a modifier (#/modifiers/…). Sets and modifiers MUST NOT reference another modifier.
  - Referencing a modifier from a set could cause inputs to apply conditional logic to a structure that can’t support it, therefore it’s not allowed.
  - Referencing a modifier from another modifier would mean a single input applies to unexpected modifiers, therefore it’s not allowed.

- A reference object MUST NOT point to anything in the resolutionOrder array (#/resolutionOrder/…). Resolution ordering, by its nature, references many other parts of the document. Duplicating any part of this will produce complex, hard-to-predict chains.

Tools MUST throw an error if encountering any invalid pointers.

#### 4.2.2 Extending

As JSON Schema 2020-12 allows, other keys MAY exist on a reference object alongside $ref. In these scenarios, the local keys alongside $ref MUST be treated as overrides.

As a generic example:

```
{
  "animal": {
    "color": "brown",
    "legs": 4
  },
  "lizard": {
    "color": "green",
    "$ref": "#/animal",
    "size": "small"
  }
}
```

The final value of #/lizard will be equivalent to:

```
{
  "color": "green",
  "legs": 4,
  "size": "small"
}
```

Key order does not matter. Since color is declared locally, it will replace the value in #/animal. Also adding the new property of size will append to the final value.

If a key alongside $ref declares an object or array, tools MUST flatten these shallowly, meaning objects and arrays are not merged.

### 4.3 $extensions

An $extensions object MAY be added to any set, modifier, or inline set/modifier, to declare arbitrary metadata that is up to individual tools to either use or ignore.

If provided, $extensions MUST be an object with the keys being vendor-specific namespaces. This allows multiple tools to use this metadata without conflict.

Here is an example where a set contains arbitrary metadata for the figma.com vendor:

```
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/resolver.json",
  "sets": {
    "color": {
      "sources": [
        { "$ref": "colors/ramps.json" },
        { "$ref": "colors/semantic.json" }
      ],
      "$extensions": {
        "figma.com": {
          "sourceFile": "https://figma.com/file/xxxxxx",
          "updatedAt": "2025-11-01"
        }
      }
    }
  }
}
```

### 4.4 $schema

A resolver document MAY include a URL to a JSON Schema document under $schema. One such schema is provided at https://www.designtokens.org/schemas/2025.10/resolver.json and is present in most examples. This does not affect resolution behavior, but provides user-friendly metadata and syntax checking for most code editors.

### 4.5 $defs

Tools MAY allow defining structures in JSON Schema $defs but is not a requirement. However, tools MUST NOT throw an error when encountering $defs, and MUST ignore the key if it is not supported.

Using $defs is undefined behavior as far as this specification is concerned, so it is up to users and toolmakers to either define a usage or avoid entirely. The specification intentionally avoids using $defs so there will be no chance of future conflict.

## 5. Inputs

A resolver document only describes how conditional token values MAY be produced. But the conditions must still be provided somewhere. The term “input” refers to any selection of context values passed to the tool.

Tools MUST accept inputs as a JSON-serializable object, such as an object in JavaScript or a dictionary in Python.

Tools that load a resolver that declares modifiers SHOULD throw an error if an accompanying input is not provided.

Given the following modifiers:

```
{
  "resolutionOrder": [
    {
      "type": "modifier",
      "name": "theme",
      "contexts": {
        "light": [{ "$ref": "light.json" }],
        "dark": [{ "$ref": "dark.json" }]
      }
    },
    {
      "type": "modifier",
      "name": "size",
      "context": {
        "default": [{ "$ref": "size/default.json" }],
        "large": [{ "$ref": "size/large.json" }]
      }
    },
    {
      "type": "modifier",
      "name": "beta",
      "context": {
        "false": [],
        "true": [{ "$ref": "beta.json" }]
      },
      "default": "false"
    }
  ]
}
```

A valid input would follow the schema: all keys correspond to the name of each modifier. The values are valid options as designated by the modifier.

```
{
  "theme": "light",
  "size": "large",
  "beta": "true"
}
```

However, an invalid input would add unknown keys, invalid contexts, and/or missing required modifiers:

```
{
  "theme": "blue",
  "foo": "bar"
}
```

In this scenario, tools SHOULD throw multiple errors along the lines of:

- Error: invalid context "blue" for modifier "theme".
- Error: missing modifier "size".
- Error: unknown modifier "foo".
- (no error needed for modifier beta, as it provided a default)

Using an imaginary tool written in JavaScript, we could potentially consume the previous example like so:

```
import tokenTool from './token-tool.js';

tokenTool.loadResolver(
  /* Path to resolver */
  './resolver.json',

  /* Input */
  {
    theme: 'dark',
    size: 'default',
  },
);
```

This imaginary tool has a loadResolver() method that takes as its parameters:

- A filepath to the resolver in the first position, and
- The input object in its 2nd position.

The tool then combines the resolver + inputs to produce its final resolution.

### 5.1 Case sensitivity

Inputs SHOULD be case-insensitive. For example, { "theme": "dark" }, { "Theme": "Dark" }, and { "THEME": "DARK" } SHOULD be equivalent. However, tools MAY make individual decisions on case sensitivity.

### 5.2 Enforcing strings

Inputs MUST have strings as their values. Tools MUST throw an error if an input contains a non-string value, such as { "beta": true } or { "size": 100 }.

## 6. Resolution logic

Tools MUST handle the resolution stages in order to produce the correct output.

- Input validation: verifying the input is valid for the given resolver document.
- Ordering: tracing the resolutionOrder array to produce the final tokens structure.
- Aliases: resolving token aliases in the final tokens structure.
- Resolution: the final end result

### 6.1 Input validation

Tools MUST require all inputs match the provided modifier contexts.

If a resolver does NOT declare any modifiers, skip this step and proceed to ordering.

- For every key in the input object:
  - Verify it corresponds with a valid modifier. If it does not, throw an error.
  - Verify that key’s value corresponds with that modifier’s allowed values. If it does not, throw an error.

- For every modifier in the resolver:
  - If that resolver does NOT declare a default value, verify a key is provided in the input. If not, throw an error.

### 6.2 Ordering

Tools MUST iterate over the resolutionOrder array in order.

For every item in the array, determine whether it’s a set or modifier, flattening into a single tokens structure in array order.

  - If the item is a set, combine the sources in array order to produce a single tokens structure.
  - Otherwise, if the item is a modifier, select only the context that matches the input, combining the array in order to produce a single tokens structure.
  - In case of a conflict, take the most recent occurrence in the array.

Repeat until you’ve reached the end of the resolutionOrder array.

The final result will be a tokens structure that behaves the same as if it were one source to begin with.

```
{
  "sets": {
    "foundation": {
      "sources": [
        {
          "color": {
            "text": {
              "default": {
                "$value": { "colorSpace": "srgb", "components": [0, 0, 0] },
                "$type": "color"
              }
            }
          }
        },
        {
          "color": {
            "text": {
              "default": {
                "$value": {
                  "colorSpace": "srgb",
                  "components": [0.1, 0.1, 0.1]
                },
                "$type": "color"
              }
            }
          }
        }
      ]
    }
  },
  "resolutionOrder": [{ "$ref": "#/sets/foundation" }]
}
```

Here, two color.text.default tokens were encountered. Since order matters, the last declaration “wins” and the final result will be:

```
{
  "color": {
    "text": {
      "default": {
        "$value": { "colorSpace": "srgb", "components": [0.1, 0.1, 0.1] },
        "$type": "color"
      }
    }
  }
}
```

### 6.3 Aliases

Aliases MUST NOT be resolved until this step.

After the ordering has been flattened into a single tokens structure, the only remaining step is resolving aliases. Aliases are resolved the exact same way as outlined in the format:

- Deep aliases are allowed, so long as they’re not circular
- An alias must point to the correct $type.

### 6.4 Resolution

We’ll start with the following file structure, followed by walking through the resolution stages step-by-step.

Resolver

```
{
  "sets": {
    "foundation": {
      "sources": [{ "$ref": "foundation.json" }]
    },
    "components": {
      "sources": [{ "$ref": "components/button.json" }]
    }
  },
  "modifiers": {
    "theme": {
      "context": {
        "light": [{ "$ref": "themes/light.json" }],
        "dark": [{ "$ref": "themes/dark.json" }]
      }
    }
  },
  "resolutionOrder": [
    { "$ref": "#/sets/foundation" },
    { "$ref": "#/sets/components" },
    { "$ref": "#/modifiers/theme" }
  ]
}
```

Input

```
{ "theme": "dark" }
```

foundation.json

- color.brand.primary (color)

components/button.json

- button.background (color)
- button.padding (dimension)

themes/light.json

- theme.accent

themes/dark.json

- theme.accent (alternate value)

- Input Validation
  - Verify that theme is a defined modifier (it passes).
  - Verify that dark is a valid value for the theme modifier (it passes).

- Ordering
  - The first item is the foundation set, providing color.brand.primary.
  - The second item is the components set, providing button.background and button.padding.
  - The third and final item is the theme modifier, providing theme.accent.
  - Thus, the final resolution includes 4 tokens.

- Alias
  - If any tokens contain aliases, only at this point may they be resolved

- Resolution
  - The final tokens spread looks like:
    - color.brand.primary (from foundation.json)
    - button.background (from components/button.json)
    - button.padding (from components/button.json)
    - theme.accent (from themes/dark.json)

Key takeaways:

- themes/light.json was never used since the input was { "theme": "dark" }.

## 7. Bundling

This section is non-normative.

A resolver document allows for the use of tokens to exist in multiple JSON files for organization. But for the purposes of portability, it may be advantageous to deal with only a single JSON document.

“Bundling” refers to the process by which a resolver document may be reduced down into a single file. There are multiple strategies to accomplish this, more than this document outlines. But for the purpose of illustration, this will outline 2 of the many possible approaches:

### 7.1 Inlining files

Inlining involves taking all reference objects to remote files, and replacing them with their contents. This is a simple strategy that accomplishes the end goal, but results in duplication whenever the same file is referenced multiple times. While a tool may not have any difficulty with duplicated tokens, a human reading this document may likely struggle reading the number of lines of code this would produce.

Given a resolver that references 5 files:

```
{
  "sets": {
    "foundation": {
      "sources": [
        { "$ref": "foundation/colors.json" },
        { "$ref": "foundation/size.json" },
        { "$ref": "foundation/typography.json" }
      ]
    }
  },
  "modifiers": {
    "theme": {
      "contexts": {
        "light": [
          { "$ref": "foundation/colors.json" },
          { "$ref": "theme/light.json" }
        ],
        "dark": [
          { "$ref": "foundation/colors.json" },
          { "$ref": "theme/dark.json" }
        ]
      }
    }
  },
  "resolutionOrder": [
    { "$ref": "#/sets/foundation" },
    { "$ref": "#/modifiers/theme" }
  ]
}
```

One could inline the contents, resulting in:

```
{
  "sets": {
    "foundation": {
      "sources": [
        {
          // (contents of foundation/colors.json)
        },
        {
          // (contents of foundation/size.json)
        },
        {
          // (contents of foundation/typography.json)
        }
      ]
    }
  },
  "modifiers": {
    "theme": {
      "contexts": {
        "light": [
          {
            // (contents of foundation/colors.json)
          },
          {
            // (contents of theme/light.json)
          }
        ],
        "dark": [
          {
            // (contents of foundation/colors.json)
          },
          {
            // (contents of theme/dark.json)
          }
        ]
      }
    }
  },
  "resolutionOrder": [
    { "$ref": "#/sets/foundation" },
    { "$ref": "#/modifiers/theme" }
  ]
}
```

The contents of the files were abbreviated for readability. Their contents could be anything and aren’t relevant to the topic of bundling.

Note that foundation/colors.json was referenced 3 times in the document, so inlining produced 3 copies of the same contents.

### 7.2 Using $defs for files

As described in $defs, $defs don’t have defined behavior in a resolver document. They may only be used if a tool decides to support this feature of JSON Schema.

This strategy involves creating a top-level $defs key, with each top-level key containing the contents for that file.

The only downside of using $defs is some tools may choose to ignore it, as it is not a minimum requirement of a resolver document.

Given the same resolver from the inlining section, we can create a new top-level $defs key, and adding keys and values that correspond to filenames and its contents, respectively:

```
{
  "sets": {
    "foundation": {
      "sources": [
        { "$ref": "#/$defs/foundation~1colors.json" },
        { "$ref": "#/$defs/foundation~1size.json" },
        { "$ref": "#/$defs/foundation~1typography.json" }
      ]
    }
  },
  "modifiers": {
    "theme": {
      "contexts": {
        "light": [
          { "$ref": "#/$defs/foundation~1colors.json" },
          { "$ref": "#/$defs/theme~1light.json" }
        ],
        "dark": [
          { "$ref": "#/$defs/foundation~1colors.json" },
          { "$ref": "#/$defs/theme~1dark.json" }
        ]
      }
    }
  },
  "resolutionOrder": [
    { "$ref": "#/sets/foundation" },
    { "$ref": "#/modifiers/theme" }
  ],
  "$defs": {
    "foundation/colors.json": {
      // (contents of foundation/colors.json)
    },
    "foundation/size.json": {
      // (contents of foundation/size.json)
    },
    "foundation/typography.json": {
      // (contents of foundation/typography.json)
    },
    "theme/light.json": {
      // (contents of theme/light.json)
    },
    "theme/dark.json": {
      // (contents of theme/dark.json)
    }
  }
}
```

Using this method, we’ve not only reduced the deduplication, but we’ve also preserved the format and shape of the original resolver document without adding any length.

It’s worth noting that when the “/” character is used in a name, it must be escaped with ~1 according to [RFC6901] so it’s not treated as a subpath. It’s also worth noting that because the filename appears after the # fragment character, “[filename].json” is referring to a point in the same document and not an actual file (otherwise it would appear before “#”).

## 8. Conformance

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.

The key words MAY, MUST, MUST NOT, SHOULD, and SHOULD NOT in this document are to be interpreted as described in BCP 14 [RFC2119] [RFC8174] when, and only when, they appear in all capitals, as shown here.

Tools implementing the Resolver Specification MUST:

- Support the Resolution Process: Implement the resolution logic as defined, including input validation, base set flattening, modifier application, aliasing, and conflict resolution.
- Validate Inputs: Ensure that provided modifier inputs match the defined modifiers and acceptable values.
- Resolve Aliases Correctly: Handle token references accurately, including recursive references and detection of circular dependencies.
- Preserve Token Properties: Maintain additional token properties (e.g., $extensions) throughout the resolution process.
- Handle Errors Gracefully: Provide meaningful error messages for issues like invalid inputs or circular references.

## A. Acknowledgments

This section is non-normative.

This resolver spec wouldn’t have happened without the Hyma Team, including but not limited to Mike Kamminga, Andrew L’Homme, and Lilith. Significant contributions were also made by Joren Broekema, Louis Chenais. We thank the members of the Design Tokens Community Group for their contributions and feedback.

## B. References

### B.1 Normative references

- [html]: HTML Standard. Anne van Kesteren; Domenic Denicola; Dominic Farolino; Ian Hickson; Philip Jägenstedt; Simon Pieters. WHATWG. Living Standard. URL: https://html.spec.whatwg.org/multipage/
- [RFC1341]: MIME (Multipurpose Internet Mail Extensions): Mechanisms for Specifying and Describing the Format of Internet Message Bodies. N. Borenstein; N. Freed. IETF. June 1992. Proposed Standard. URL: https://www.rfc-editor.org/rfc/rfc1341
- [RFC2119]: Key words for use in RFCs to Indicate Requirement Levels. S. Bradner. IETF. March 1997. Best Current Practice. URL: https://www.rfc-editor.org/rfc/rfc2119
- [RFC6838]: Media Type Specifications and Registration Procedures. N. Freed; J. Klensin; T. Hansen. IETF. January 2013. Best Current Practice. URL: https://www.rfc-editor.org/rfc/rfc6838
- [RFC6901]: JavaScript Object Notation (JSON) Pointer. P. Bryan, Ed.; K. Zyp; M. Nottingham, Ed. IETF. April 2013. Proposed Standard. URL: https://www.rfc-editor.org/rfc/rfc6901
- [RFC8174]: Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words. B. Leiba. IETF. May 2017. Best Current Practice. URL: https://www.rfc-editor.org/rfc/rfc8174
- [RFC8259]: The JavaScript Object Notation (JSON) Data Interchange Format. T. Bray, Ed. IETF. December 2017. Internet Standard. URL: https://www.rfc-editor.org/rfc/rfc8259
- [w3c-process]: W3C Process Document. Elika J. Etemad (fantasai); Florian Rivoal. W3C. 18 August 2025. URL: https://www.w3.org/policies/process/
↑
