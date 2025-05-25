interface DeleteTaskFormProps {
  taskId: number;
}

const DeleteTaskForm = ({ taskId }: DeleteTaskFormProps) => {
  const hxOnDeleteTask = { 
    'hx-on:htmx:after-request': 'if(event.detail.successful) { this.reset(); htmx.find("#delete-task-dialog").close(); }' 
  };
  return (
    <form
      id="delete-task-form"
      method="dialog" 
      hx-delete={`/htmx/task/${taskId}`} 
      hx-target="#alerts" 
      hx-swap="beforeend"
      {...hxOnDeleteTask}
    >
      <section class="card-header grid">
      <span class="col-1"></span>
        <h2 class="text-center col-10">Delete Task</h2>

        <span class="col-1">
          <button
              class="btn btn-icon btn-outline-danger col-1"
              type="button"
              title="Cancel Task Deletion"
              x-on:click="htmx.find('#delete-task-dialog').close()"
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
        </span>

      </section>

      <section class="card-body">
        <p class="text-center">
          Are you sure you want to delete task with ID <strong>{taskId}</strong>?
        </p>
      </section>

      <section class="card-footer wrapped-row">
        <button 
          type="submit"
          title="Delete Task"
          class="btn btn-outline-danger"
        >
          Delete Task
        </button>
      </section>
    </form>
  );
};

export { DeleteTaskForm, type DeleteTaskFormProps };