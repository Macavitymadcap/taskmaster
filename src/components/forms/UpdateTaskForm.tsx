interface UpdateTaskFormProps {
  id: number;
  title: string;
  description?: string;
  status: "completed" | "in-progress" | "pending";
  due_date: string;
}

const UpdateTaskForm = ({
  id,
  title,
  description,
  status,
  due_date,
}: UpdateTaskFormProps) => {
  const hxOnUpdateTask = {
    "hx-on:htmx:after-request":
      'if(event.detail.successful) { this.reset(); htmx.find("dialog").close(); }',
  };

  return (
    <form
      hx-put={`/task/${id}`}
      hx-target={`#task-${id}`}
      hx-swap="outerHTML"
      {...hxOnUpdateTask}
    >
      <section class=" card-header grid">
        <span class="badge col-1">{id}</span>

        <h2 class="text-center col-10">Update Task</h2>

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

      <section class="card-body flex-wrap">
        <div class="form-group">
          <label for={`title-${id}`}>Title</label>
          <input
            type="text"
            id={`title-${id}`}
            name="title"
            required
            value={title}
          />
        </div>
        <div class="form-group">
          <label for={`description-${id}`}>Description</label>
          <textarea
            id={`description-${id}`}
            name="description"
            placeholder="Task description"
          >
            {description ?? ""}
          </textarea>
        </div>

        <div class="form-group">
          <label for={`due_date-${id}`}>Due Date</label>
          <input
            type="datetime-local"
            id={`due_date-${id}`}
            name="dueDate"
            class="form-control"
            value={new Date(due_date)
              .toISOString()
              .slice(0, 16)
              .replace("T", " ")}
            required
          />
        </div>

        <div class="form-group">
          <label for={`status-${id}`}>Status</label>
          <select id={`status-${id}`} name="status" value={status}>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </section>

      <section class="card-footer wrapped-row">
        <button
          title="Update Task"
          type="submit"
          class="btn btn-outline-secondary"
        >
          Update
        </button>
      </section>
    </form>
  );
};

export {
  UpdateTaskForm,
  type UpdateTaskFormProps,
};
