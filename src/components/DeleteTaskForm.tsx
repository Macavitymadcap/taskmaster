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
      <h2 class="text-center">Delete Task</h2>

      <p class="text-center">
        Are you sure you want to delete task with ID <strong>{taskId}</strong>?
      </p>

      <button 
        type="submit" 
        class="btn btn-outline-danger"
      >
        Delete Task
      </button>

      <button 
        type="button" 
        class="btn btn-outline-warning" 
        x-on:click="htmx.find('#delete-task-dialog').close()"
      >
        Cancel
      </button>
    </form>
  );
};

export { DeleteTaskForm, type DeleteTaskFormProps };