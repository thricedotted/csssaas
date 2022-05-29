<script>
  export let query = { 
    url: '', 
    selector: '',
    include: []
  }

  const includeOptions = [
    'type', 
    'tagName', 
    'attributes', 
    'children', 
    'textContent'
  ]
</script>

<form
  method="GET"
  action="/"
  >
  <label
    class="text"
    >
    <span>URL</span>
    <input 
      type="url" 
      name="url"
      bind:value={query.url}
    />
  </label>

  <label
    class="text"
    >
    <span>Selector</span>
    <input 
      type="text" 
      name="selector"
      bind:value={query.selector}
    />
  </label>

  <fieldset>
    <legend>Include</legend>
      {#each includeOptions as value}
      <label
        class:checked={query.include.includes(value)}>
        <input 
          name="include"
          type="checkbox" 
          bind:group={query.include}
          {value}
        />{value}
      </label>
      {/each}
  </fieldset>

  <button
    type="submit"
    >
    Load in Data Viewer
  </button>
</form>

<style>
  form > * + * {
    margin: 2ch 0;
  }

  label {
    display: block;
    white-space: nowrap;
  }

  .text {
    display: flex;
    align-items: baseline;  
    gap: var(--space-s);
  }

  span {
    display: inline-block;
    width: 10ch;
  }

  input[type="url"],
  input[type="text"] {
    flex: 1;
  }

  fieldset {
    display: flex;
    flex-flow: row wrap;
    gap: var(--space-s) var(--space-m);
    margin: 0;
  }

  label.checked {
    font-weight: bold;
  }

  input[type="checkbox"] {
    margin-right: 0.5ch;
  }
</style>