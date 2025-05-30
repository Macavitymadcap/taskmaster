const CreateTaskForm = () => {
  const hxOnCreateSuccessful = {
    "hx-on:htmx:after-request": "if(event.detail.successful) { htmx.find('dialog').close(); }",
  }

  return (
    <form
      id="create-task-form"
      hx-post="/task"
      hx-target="#tasks"
      hx-swap="beforeend"
      {...hxOnCreateSuccessful}
    >
      <section className="card-header grid">
        <span className="col-1"></span>
        
        <h2 className="text-center col-10">Add New Task</h2>
        
        <button
          className="btn btn-icon btn-outline-danger col-1"
          type="button"
          title="Cancel Task Creation"
          x-on:click="htmx.find('dialog').close()"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 18L18 6"></path>
            <path d="M6 6l12 12"></path>
          </svg>
        </button>
      </section>

      <section className="card-body grid">
        <div className="form-group col-12">
          <label htmlFor="title">Title</label>

          <input
            type="text"
            id="title"
            name="title"
            placeholder="Task title"
            required
          />

          <span className="text-danger text-sm"></span>
        </div>

        <div className="form-group col-12">
          <label htmlFor="description">Description</label>

          <textarea
            id="description"
            name="description"
            placeholder="Task description"
            rows={3}
            maxLength={1000}
          ></textarea>
          
          <span className="text-danger text-sm"></span>
        </div>

        <div className="form-group col-12">
          <label htmlFor="due-date">Due Date</label>

          <input
            type="datetime-local"
            id="due-date"
            name="dueDate"
            required
          />

          <span className="text-danger text-sm"></span>
        </div>

        <div className="form-group col-12">
          <label htmlFor="status">Status</label>

          <select
            id="status"
            name="status"
            required
          >
            <option value="in-progress">In Progress</option>
            <option value="overdue">Overdue</option>
            <option value="completed">Completed</option>
          </select>

          <span className="text-danger text-sm"></span>
        </div>
      </section>

      <section className="card-footer wrapped-row">
        <button
          className="btn btn-outline-success"
          type="submit"
          title="Add Task"
        >
          Add
        </button>

        <button className="btn btn-outline-warning" type="reset" title="Reset Form">
          Reset
        </button>
      </section>
    </form>
  );
};

export { CreateTaskForm };