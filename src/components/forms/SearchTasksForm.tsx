export const SearchTasksForm = () => {
  const hxOnSearchSubmitted = {
    "hx-on:htmx:after-request": "htmx.find('dialog').close();",
  }
  return (
    <form
      id="search-tasks-form"
      hx-post="/task/search"
      hx-target="#tasks"
      hx-swap="innerHTML"
      method="dialog"
      {...hxOnSearchSubmitted}
    >
      <section class=" card-header grid">
        <span class="col-1"></span>
        <h2 class="text-center col-10">Search Tasks</h2>

        <button
          title="Cancel Update"
          type="button"
          class="btn btn-icon btn-outline-danger col-1"
          x-on:click="htmx.find('dialog').close();"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M6 18L18 6"></path>

            <path d="M6 6l12 12"></path>
          </svg>
        </button>
      </section>

      <search className="card-body">
        <div className="form-group">
          <label htmlFor="search">Search by ID</label>

          <input
            type="number"
            id="search"
            name="id"
          />

        </div>
      </search>

      <section className="card-footer wrapped-row">
        <button type="submit" className="btn btn-outline-primary">
          Search
        </button>

        <button className="btn btn-outline-warning" type="reset" title="Reset Form">
          Reset
        </button>
      </section>
    </form>
  )
};