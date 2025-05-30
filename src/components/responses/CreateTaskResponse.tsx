import { 
  Alert, 
  type AlertProps,
  ReadTask, 
  type ReadTaskProps,
} from "../organisms";

interface CreateTaskResponseProps {
  alert: AlertProps;
  task?: ReadTaskProps;
}

export const CreateTaskResponse = ({
  alert,
  task,
}: CreateTaskResponseProps) => {
  const alertHtml = Alert(alert);
  const taskHtml = task ? ReadTask(task) : "";

  return `
    <div hx-swap-oob="beforeend:#alerts">
      ${alertHtml}
    </div>
    ${taskHtml}
  `;
};
