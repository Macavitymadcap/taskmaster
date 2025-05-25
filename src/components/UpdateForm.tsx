interface UpdateFormProps {
  id: number;
  title: string;
  description?: string;
  status: "completed" | "in-progress" | "pending";
  due_date: string;
}

const UpdateForm = ({
  id,
  title,
  description,
  status,
  due_date,
}: UpdateFormProps) => {

  return (
    <form
      id={`task-${id}`}
      hx-put={`/htmx/task/${id}`} 
      hx-target={`#task-${id}`} 
      hx-swap="outerHTML"
      class="card card-outline-primary">
      <div class="content grid">
        <span class="col-11">
            <span class="badge badge-primary">{id}</span>
        </span>

        <button
          title="Cancel Update"
          class="btn btn-icon btn-outline-danger col-1"
          hx-get={`/htmx/task/${id}`}
          hx-target={`#task-${id}`}
          hx-swap="outerHTML"
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
      </div>
      
      <div class="card-header form-group">
        <label for={`title-${id}`}>Title</label>
        <input
          type="text"
          id={`title-${id}`}
          name="title"
          required
          value={title}
        />
      </div>

      <div class="card-body flex-wrap">
        <div class="form-group">
          <label for={`description-${id}`}>Description</label>
          <textarea
            id={`description-${id}`}
            name="description"
            placeholder="Task description"
          >{description ?? ""}</textarea>        
        </div>

        <div class="form-group">
          <label for={`due_date-${id}`}>Due Date</label>
          <input
            type="datetime-local"
            id={`due_date-${id}`}
            name="due_date"
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
          <select
            id={`status-${id}`}
            name="status"
            value={status}
          >
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="pending">Pending</option>
          </select>
      </div>

      <div class="card-footer">

                  <button
          title="Submit Update"
          class="btn btn-outline-primary"
        >
          Update Task
        </button>
        </div>
      </div>
    </form>
  );
};

export { UpdateForm, type UpdateFormProps };
