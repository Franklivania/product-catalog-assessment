# Typography Components

A comprehensive set of typography components built with Tailwind CSS and class-variance-authority, following shadcn/ui patterns. These components are optimized for accessibility, screen readers, and responsive design.

## Components

### Typography (Base Component)

The foundational component that all other typography components extend from. Supports both variant-based and dot notation APIs.

```jsx
import { Typography } from "@/components/ui/typography"

// Variant API (original)
<Typography variant="h1">Main Heading</Typography>
<Typography variant="p" responsive>Responsive paragraph</Typography>
<Typography variant="lead">Lead paragraph</Typography>

// Dot Notation API (new)
<Typography.h1>Main Heading</Typography.h1>
<Typography.p responsive>Responsive paragraph</Typography.p>
<Typography.lead>Lead paragraph</Typography.lead>
<Typography.BQ cite="https://example.com">Blockquote</Typography.BQ>
```

### Heading

Semantic heading component with automatic element mapping.

```jsx
import { Heading } from "@/components/ui/typography"

<Heading level={1}>H1 Heading</Heading>
<Heading level={2} responsive>Responsive H2</Heading>
<Heading level={3} className="text-blue-600">Custom styled H3</Heading>
```

### Paragraph

Paragraph component with lead and muted variants.

```jsx
import { Paragraph } from "@/components/ui/typography"

<Paragraph>Regular paragraph text</Paragraph>
<Paragraph lead>Lead paragraph with larger text</Paragraph>
<Paragraph muted>Muted paragraph text</Paragraph>
<Paragraph responsive>Responsive paragraph</Paragraph>
```

### Blockquote

Semantic blockquote component with citation support.

```jsx
import { Blockquote } from "@/components/ui/typography"

<Blockquote>
  "The best way to predict the future is to invent it."
</Blockquote>

<Blockquote cite="https://example.com" responsive>
  "Design is not just what it looks like and feels like. Design is how it works."
</Blockquote>
```

### Code

Inline code component with proper styling.

```jsx
import { Code } from "@/components/ui/typography"

<Code>npm install</Code>
<Code className="bg-red-100">const example = true;</Code>
```

### List & ListItem

Semantic list components with ordered/unordered support.

```jsx
import { List, ListItem } from "@/components/ui/typography"

<List>
  <ListItem>First item</ListItem>
  <ListItem>Second item</ListItem>
  <ListItem>Third item</ListItem>
</List>

<List ordered>
  <ListItem>First step</ListItem>
  <ListItem>Second step</ListItem>
  <ListItem>Third step</ListItem>
</List>
```

## Props

### Common Props

All components accept these common props:

| Prop         | Type      | Default | Description                              |
| ------------ | --------- | ------- | ---------------------------------------- |
| `className`  | `string`  | -       | Additional CSS classes                   |
| `asChild`    | `boolean` | `false` | Render as child element using Radix Slot |
| `responsive` | `boolean` | `false` | Enable responsive font sizing            |

### Typography Props

| Prop      | Type                                                                                                                                 | Default | Description        |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------- | ------------------ |
| `variant` | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6" \| "p" \| "blockquote" \| "lead" \| "large" \| "small" \| "muted" \| "code" \| "list"` | `"p"`   | Typography variant |
| `size`    | `"xs" \| "sm" \| "base" \| "lg" \| "xl" \| "2xl" \| "3xl" \| "4xl" \| "5xl"`                                                         | -       | Override font size |

### Heading Props

| Prop    | Type                         | Default | Description                   |
| ------- | ---------------------------- | ------- | ----------------------------- |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1`     | Heading level (maps to h1-h6) |

### Paragraph Props

| Prop    | Type      | Default | Description               |
| ------- | --------- | ------- | ------------------------- |
| `lead`  | `boolean` | `false` | Render as lead paragraph  |
| `muted` | `boolean` | `false` | Render with muted styling |

### Blockquote Props

| Prop   | Type     | Default | Description  |
| ------ | -------- | ------- | ------------ |
| `cite` | `string` | -       | Citation URL |

### List Props

| Prop      | Type      | Default | Description                 |
| --------- | --------- | ------- | --------------------------- |
| `ordered` | `boolean` | `false` | Render as ordered list (ol) |

## Variants

### Typography Variants

- `h1-h6`: Semantic headings with appropriate font sizes and spacing
- `p`: Regular paragraph text
- `blockquote`: Styled blockquote with left border
- `lead`: Larger paragraph text for introductions
- `large`: Large text for emphasis
- `small`: Small text with medium font weight
- `muted`: Muted text color
- `code`: Inline code styling
- `list`: Unordered list styling

### Size Variants

- `xs`: Extra small text
- `sm`: Small text
- `base`: Base text size
- `lg`: Large text
- `xl`: Extra large text
- `2xl-5xl`: Progressively larger text sizes

### Responsive Variants

When `responsive={true}` is set, components automatically scale across breakpoints:

- **H1**: `text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl`
- **H2**: `text-xl sm:text-2xl md:text-3xl lg:text-4xl`
- **H3**: `text-lg sm:text-xl md:text-2xl lg:text-3xl`
- **H4**: `text-base sm:text-lg md:text-xl lg:text-2xl`
- **H5**: `text-sm sm:text-base md:text-lg lg:text-xl`
- **H6**: `text-xs sm:text-sm md:text-base lg:text-lg`
- **Paragraph**: `text-sm sm:text-base md:text-lg`
- **Lead**: `text-lg sm:text-xl md:text-2xl`

## Accessibility Features

### Semantic HTML

- Components use appropriate semantic HTML elements
- Headings maintain proper hierarchy
- Lists use `ul`/`ol` and `li` elements
- Blockquotes use semantic `blockquote` element

### Screen Reader Support

- Proper heading structure for navigation
- Semantic elements provide context
- Citation support for blockquotes
- No decorative elements that confuse screen readers

### Keyboard Navigation

- All components support standard keyboard navigation
- Focus management follows web standards
- No custom focus traps or unusual behavior

### Color Contrast

- Uses CSS custom properties for theming
- Muted text maintains sufficient contrast
- High contrast mode compatible

## Advanced Usage

### Composition with asChild

Use the `asChild` prop to compose with other components:

```jsx
<Typography asChild variant="h1">
  <Link href="/home">Homepage Link</Link>
</Typography>

<Heading asChild level={2}>
  <button onClick={handleClick}>Interactive Heading</button>
</Heading>
```

### Custom Styling

Extend components with additional classes:

```jsx
<Typography
  variant="h1"
  className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
>
  Gradient Heading
</Typography>

<Paragraph className="first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-3">
  Drop cap paragraph with custom first letter styling.
</Paragraph>
```

### Responsive Design

Combine responsive variants with custom breakpoints:

```jsx
<Heading level={1} responsive className="xl:text-8xl">
  Extra large on XL screens
</Heading>

<Paragraph responsive className="lg:text-xl lg:leading-8">
  Custom responsive paragraph
</Paragraph>
```

## Dot Notation API

The Typography component now supports a convenient dot notation API for common elements:

### Available Dot Notation Components

- `Typography.h1` through `Typography.h6` - Heading elements
- `Typography.p` - Paragraph element (supports `lead` and `muted` props)
- `Typography.BQ` - Blockquote element (supports `cite` prop)
- `Typography.code` - Inline code element
- `Typography.lead` - Lead paragraph
- `Typography.large` - Large text
- `Typography.small` - Small text element
- `Typography.muted` - Muted paragraph

### Dot Notation Examples

```jsx
// Headings
<Typography.h1 responsive>Main Title</Typography.h1>
<Typography.h2 className="text-blue-600">Subtitle</Typography.h2>
<Typography.h3>Section Title</Typography.h3>

// Paragraphs
<Typography.p>Regular paragraph</Typography.p>
<Typography.p lead>Lead paragraph</Typography.p>
<Typography.p muted>Muted paragraph</Typography.p>

// Blockquotes
<Typography.BQ cite="https://example.com">
  "This is a quote with citation"
</Typography.BQ>

// Other elements
<Typography.code>npm install</Typography.code>
<Typography.small>Small text</Typography.small>
<Typography.large>Large emphasized text</Typography.large>

// Composition with asChild
<Typography.h1 asChild>
  <Link href="/home">Interactive Heading</Link>
</Typography.h1>
```

## Examples

### Article Layout (Using Dot Notation)

```jsx
function Article({ title, subtitle, content, author, date }) {
  return (
    <article>
      <Typography.h1 responsive>{title}</Typography.h1>
      <Typography.p lead className="mb-8">
        {subtitle}
      </Typography.p>

      <div className="prose">
        <Typography.p>{content}</Typography.p>

        <Typography.BQ cite="https://example.com">
          "This is an important quote from the article."
        </Typography.BQ>

        <List>
          <ListItem>Key point one</ListItem>
          <ListItem>Key point two</ListItem>
          <ListItem>Key point three</ListItem>
        </List>
      </div>

      <footer className="mt-8">
        <Typography.small className="text-muted-foreground">
          By {author} on {date}
        </Typography.small>
      </footer>
    </article>
  );
}
```

### Mixed API Usage

```jsx
function Documentation() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Dot notation for simple cases */}
      <Typography.h1 responsive>API Documentation</Typography.h1>
      <Typography.lead>Complete guide to using our API</Typography.lead>

      {/* Original API for complex cases */}
      <Typography variant="h2">Authentication</Typography>
      <Typography.p>Use your API key to authenticate requests:</Typography.p>
      <Typography.code>Authorization: Bearer YOUR_API_KEY</Typography.code>

      {/* Lists still use dedicated components */}
      <List ordered>
        <ListItem>1000 requests per hour for free tier</ListItem>
        <ListItem>10000 requests per hour for pro tier</ListItem>
      </List>
    </div>
  );
}
```

### Clean and Concise Usage

```jsx
function BlogPost({ post }) {
  return (
    <article className="prose max-w-none">
      <Typography.h1 responsive>{post.title}</Typography.h1>
      <Typography.muted>Published on {post.date}</Typography.muted>

      <Typography.lead>{post.excerpt}</Typography.lead>

      <Typography.p>{post.content}</Typography.p>

      <Typography.BQ cite={post.quoteSource}>{post.quote}</Typography.BQ>

      <Typography.h2>Key Takeaways</Typography.h2>
      <List>
        {post.takeaways.map((item, index) => (
          <ListItem key={index}>{item}</ListItem>
        ))}
      </List>

      <Typography.small>
        Use <Typography.code>npm install {post.package}</Typography.code> to get
        started
      </Typography.small>
    </article>
  );
}
```
