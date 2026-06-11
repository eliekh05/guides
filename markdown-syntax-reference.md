---
layout: default
title: "Markdown Syntax Reference"
parent: "macOS"
nav_order: 23
---

# Markdown Syntax Reference

Markdown is a lightweight way to format text. It is used by GitHub, this site, Notion, many documentation tools, and chat apps.

---

## Headings

```
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
```

---

## Text Formatting

```
**bold**
*italic*
~~strikethrough~~
`inline code`
**_bold and italic_**
```

Result: **bold**, *italic*, ~~strikethrough~~, `inline code`

---

## Links and Images

```
[Link text](https://example.com)
[Link with title](https://example.com "Title here")
![Alt text](image.png)
![Alt text](https://example.com/image.png)
```

---

## Lists

**Unordered:**
```
- Item one
- Item two
  - Nested item
  - Nested item
- Item three
```

**Ordered:**
```
1. First
2. Second
3. Third
```

---

## Code

**Inline:** wrap in backticks: `` `code` ``

**Block:** wrap in triple backticks with optional language:

````
```bash
sudo apt update
```

```python
print("Hello")
```
````

---

## Tables

```
| Column 1 | Column 2 | Column 3 |
|---|---|---|
| Cell | Cell | Cell |
| Cell | Cell | Cell |
```

Alignment:
```
| Left | Center | Right |
|:---|:---:|---:|
| text | text | text |
```

---

## Blockquotes

```
> This is a blockquote
> It can span multiple lines

> > Nested blockquote
```

---

## Horizontal Rule

```
---
```

---

## Task Lists (GitHub Markdown)

```
- [x] Done
- [ ] Not done
- [x] Also done
```

---

## Footnotes (GitHub / Just the Docs)

```
This has a footnote.[^1]

[^1]: This is the footnote text.
```

---

## Escaping Characters

Put `\` before a character to show it literally:

```
\*not italic\*
\# not a heading
\`not code\`
```

---

## HTML in Markdown

Most Markdown renderers accept inline HTML:

```html
<br>                        line break
<details><summary>Title</summary>Content</details>    collapsible
```

---

## Just the Docs Specific (This Site)

```yaml
---
layout: default
title: "Page Title"
parent: "macOS"
nav_order: 1
---
```

Front matter at the top of every `.md` file sets where the page appears in the sidebar.
