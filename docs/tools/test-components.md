---
layout: home

hero:
  name: "VitePress Components"
  text: "A Demonstration of Available Components"
  tagline: Explore the power and flexibility of VitePress
  image:
    src: https://cdn.builder.io/api/v1/image/assets%2F5729da240c404db0a5adeed7b8d8ae9f%2Ff9254782244c4e3180d5c7d5feb890fd
    alt: Aleph.im
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/vuejs/vitepress

features:
  - icon: 🚀
    title: Performance
    details: Static site generation provides excellent loading performance
  - icon: 🔧
    title: Customizable
    details: Extend or customize the default theme with your own components
  - icon: 📱
    title: Responsive
    details: Looks great on any device, with mobile-friendly design
  - icon: 🔍
    title: SEO Ready
    details: Automatically generates SEO-friendly HTML for better discoverability

team:
  - avatar: https://www.github.com/github-avatar.png
    name: Team Member 1
    title: Developer
    links:
      - icon: github
        link: https://github.com/member1
      - icon: twitter
        link: https://twitter.com/member1
  - avatar: https://www.github.com/github-avatar.png
    name: Team Member 2
    title: Designer
    links:
      - icon: github
        link: https://github.com/member2
      - icon: twitter
        link: https://twitter.com/member2
---

# VitePress Component Showcase

This page demonstrates the various components available in VitePress.

## Table of Contents

[[toc]]

## Custom Containers

VitePress provides several custom containers to highlight content:

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details Click me to view more
This content is initially hidden but can be revealed by clicking.
:::

## Badges

You can add badges to your text:

- Default badge <Badge text="default" />
- Tip badge <Badge type="tip" text="tip" />
- Warning badge <Badge type="warning" text="warning" />
- Danger badge <Badge type="danger" text="danger" />

## Code Groups

Code groups allow you to display multiple code blocks in tabs:

::: code-group

```js [JavaScript]
export default {
  data() {
    return {
      msg: 'Hello from JavaScript!'
    }
  }
}
```

```ts [TypeScript]
interface Data {
  msg: string
}

export default {
  data(): Data {
    return {
      msg: 'Hello from TypeScript!'
    }
  }
}
```

```python [Python]
def hello():
    return "Hello from Python!"
```

:::

## Aside Component

Regular content flows here.

::: aside
This is an aside that appears in the margin on larger screens.
:::

More regular content here.

## Custom Dividers

---

## Emoji Support

:smile: :rocket: :tada:

## Math Equations (if enabled in config)

Inline equation: $E = mc^2$

Block equation:

$$
\frac{d}{dx}e^x = e^x
$$

## Footnotes

Here's a sentence with a footnote[^1].

[^1]: This is the footnote content.

## Task Lists

- [x] Write the documentation
- [x] Add examples
- [ ] Publish the documentation

## Line Highlighting in Code Blocks

```js{1,3-5}
// This line is highlighted
console.log('Regular line')
// These lines are highlighted
const x = 100
console.log(x)
```

## Custom Containers with Titles

::: info Custom Title
This info box has a custom title.
:::

## Images with Captions

![Aleph.im Logo](https://cdn.builder.io/api/v1/image/assets%2F5729da240c404db0a5adeed7b8d8ae9f%2Ff9254782244c4e3180d5c7d5feb890fd)
*This is an image caption*

## Diagrams with Mermaid (if enabled in config)

```mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
```

## Interactive Components (Vue Components)

<div class="demo-component">
  <!-- Vue components would go here if registered -->
  <p>This is where custom Vue components can be placed.</p>
</div>

<style>
.demo-component {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin: 20px 0;
  text-align: center;
}
</style>
