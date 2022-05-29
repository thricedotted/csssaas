<script>
  import { page } from '$app/stores'

  export let query = { 
    url: '', 
    selector: '',
    include: ['tagName', 'textContent']
  }

  $: ({ url, selector, include } = query)
</script>

<code>
  <pre>const query = &lbrace;
  url: `{url}`,
  selector: `{selector}`,
  include: {JSON.stringify(include)}
&rbrace;

const searchParams = new URLSearchParams(query)

const res = await fetch(
  `{$page.url.origin}?$&lbrace;searchParams&rbrace;`,
  &lbrace; headers: &lbrace; 'Accept': 'application/json' &rbrace; &rbrace;
)

const body = await res.json()</pre>
</code>

<style>
  code {
    display: block;
    margin-top: var(--space-xs);
    padding: var(--space-s);
    background: black;
    color: white;
    max-width: 100%;
    overflow: auto;
    font-size: 1rem;
  }

  pre {
    margin: 0;
  }
</style>