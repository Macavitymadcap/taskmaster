import { CreateTaskValidator, CreateTaskRequest } from "../../validation";

interface CreateTaskFormProps {
  errors?: { [key: string]: string };
  values?: Partial<CreateTaskRequest>;
}

const CreateTaskForm = ({ errors = {}, values = {} }: CreateTaskFormProps) => {
  return (
    <form
      id="create-task-form"
      hx-post="/task"
      hx-target="#tasks"
      hx-swap="beforeend"
    >
      <div className="card-header grid">
        <span className="col-1"></span>
        <h2 className="text-center col-10">Add New Task</h2>
        <button
          className="btn btn-icon btn-outline-danger col-1"
          type="button"
          title="Cancel Task Creation"
          onClick={() => {
            if (typeof window !== 'undefined' && window.htmx) {
              window.htmx.find('#create-task-form').reset();
              window.htmx.find('#create-task-dialog').close();
            }
          }}
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
      </div>

      <section className="grid">
        <div className="form-group col-6">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Task title"
            required
            defaultValue={values.title || ""}
            className={errors.title ? "form-control error" : "form-control"}
          />
          <span className="text-danger text-sm">{errors.title}</span>
        </div>

        <div className="form-group col-6">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Task description"
            rows={3}
            maxLength={1000}
            defaultValue={values.description || ""}
            className={errors.description ? "form-control error" : "form-control"}
          ></textarea>
          <span className="text-danger text-sm">{errors.description}</span>
        </div>
      </section>

      <section className="grid">
        <div className="form-group col-6">
          <label htmlFor="due-date">Due Date</label>
          <input
            type="datetime-local"
            className={errors.dueDate ? "form-control error" : "form-control"}
            id="due-date"
            name="dueDate"
            required
            defaultValue={values.dueDate || ""}
          />
          <span className="text-danger text-sm">{errors.dueDate}</span>
        </div>

        <div className="form-group col-6">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            className={errors.status ? "form-control error" : "form-control"}
            name="status"
            defaultValue={values.status || "pending"}
            required
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <span className="text-danger text-sm">{errors.status}</span>
        </div>
      </section>

      <section className="wrapped-row">
        <button
          className="btn btn-outline-primary"
          type="submit"
          title="Submit Task"
        >
          Create Task
        </button>

        <button className="btn btn-outline-warning" type="reset" title="Reset Form">
          Reset Form
        </button>
      </section>
    </form>
  );
};

export { CreateTaskForm, type CreateTaskFormProps };