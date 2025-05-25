import { htmx } from "../routes/htmx";

interface ReadTaskProps {
  id: number;
  title: string;
  description?: string;
  status: "completed" | "in-progress" | "pending";
  due_date: string;
}

const ReadTask = ({
  id,
  title,
  description,
  status,
  due_date,
}: ReadTaskProps) => {
  const props: { [key: string]: string } = {
    id: `task-${id}`,
    class: 'card',
  };

  const hxOnGetDeleteForm = { 
    'hx-on:htmx:after-request': 'if(event.detail.successful) { htmx.find("#delete-task-dialog").showModal(); }'
  };

  return (
    <div {...props}>
      <div class="content grid">
        <span class="col-10">
          <span class="badge">{id}</span>
        </span>

        <button
          title="Update Task"
          class="btn btn-icon btn-outline-primary col-1"
          hx-get={`/htmx/update-form/${id}`}
          hx-target={`#task-${id}`}
          hx-swap="outerHTML"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M2 14.5V18h3.5l10.06-10.06-3.5-3.5L2 14.5zm14.85-7.35a1.003 1.003 0 0 0 0-1.42l-2.58-2.58a1.003 1.003 0 0 0-1.42 0l-1.34 1.34 3.5 3.5 1.34-1.34z" />
          </svg>
        </button>

        <button
          title="Delete Task"
          class="btn btn-icon btn-outline-danger col-1"
          hx-get={`/htmx/delete-form/${id}`}
          hx-target="#delete-task-dialog"
          {...hxOnGetDeleteForm} 
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

      <h2 class="card-header text-center">{title}</h2>

      <div class="card-body">{description ? <p>{description}</p> : <br />}</div>

      <div class="card-footer content grid">
        <span class="col-12">
          <strong>Due:</strong>
          {` `}
          <span>{new Date(due_date).toLocaleDateString()}</span>
          {` `}
          <span>
            {new Date(due_date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </span>

        <span class="col-12">
          <span
            class={`
              badge
              ${status === "in-progress" ? "badge-warning" : ""}
              ${status === "completed" ? "badge-success" : ""}
              ${status === "pending" ? "badge-secondary" : ""}
            `}
          >
            {status.toUpperCase()}
          </span>
        </span>
      </div>
    </div>
  );
};

export { ReadTask, ReadTaskProps };
