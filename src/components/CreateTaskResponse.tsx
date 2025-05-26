import { ReadTask, ReadTaskProps } from "./ReadTask";
import { Alert, AlertProps } from "./Alert";

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
