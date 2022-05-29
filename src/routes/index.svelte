<script>
  import '$lib/global.css'

  import Form from '$lib/Form.svelte'
  import Code from '$lib/Code.svelte'

  import { JsonView } from '@zerodevx/svelte-json-view'

  export let query = { 
    url: '', 
    selector: '',
    include: ['tagName', 'textContent']
  }

  export let data
  export let status, message
</script>

<svelte:head>
  <title>
    CSS Selectors as a Service
  </title>
</svelte:head>

<header>
  <h1>
    Cascading Style Sheet Selectors as a Service
  </h1>
  <p>"who asked for this? literally nobody"</p>
</header>

<main>
  <div class="form-and-code">
    <h2>Query Builder</h2>
    <Form
      bind:query
    />

    <details>
      <summary>JavaScript Code</summary>
      {#if query.url}
        <Code
          {query}
        />
      {:else}
        <p>
          When you build a query, the code to run it will display here.
        </p>
      {/if}
    </details>
  </div>

  <div class="data">
    <h2>Data Viewer</h2>

    {#if data}
      <JsonView 
        json={data} 
      />
    {:else if status || message}
      <JsonView 
        json={{ status, message }} 
      />
    {:else}
      <p>
        When you run a query, data will display here.
      </p>
    {/if}
  </div>
</main>

<footer>
  <details>
    <summary>
      Everything Anyone Could Possibly Want To Know About CSSSAAS
    </summary>

    <dl>
      <dt>What?</dt>
      <dd>
        <p>Look. What if you could get some HTML from any website, helpfully pared down with a <a href="https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors">CSS selector</a>, as JSON. Doesn't that sound like extremely normal fun.</p>
      </dd>

      <dt>How?</dt>
      <dd>
        <p>Well. We just... fetch the website and select the Good Parts with <a href="https://www.npmjs.com/package/htmlparser2">htmlparser2 and friends</a> and get a workable JSON representation with <a href="https://www.npmjs.com/package/himalaya">himalaya</a>. Anyway, yes the code is on <a href="https://github.com/thricedotted/csssaas">github</a>.</p>
      </dd>

      <dt>Is this a proxy? A scraper?</dt>
      <dd>
        <p>Uhhhhhhhhh</p>
      </dd>

      <dt>You didn't answer my question!!!!</dt>
      <dd>
        <p>Oops</p>
      </dd>

    </dl>

  </details>
</footer>

<style>
  header, main {
    margin: var(--space-s);
  }

  header {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: space-between;
  }

  main {
    display: flex;
    flex-flow: row wrap;
    gap: var(--space-s);
  }

  main > div {
    flex: 1 1 60ch;
    border: 1px solid black;
    padding: var(--space-s);
    width: 100%;
  }

  .data {
    max-height: 80vh;
    overflow: auto;
  }

  .data h2 {
    background: white;
    width: max-content;
    position: sticky;
    top: 0;
  }

  footer {
    max-width: 80ch;
    position: relative;
    margin: auto;
    padding: var(--space-s);
  }

  footer summary {
    text-align: center;
  }
</style>