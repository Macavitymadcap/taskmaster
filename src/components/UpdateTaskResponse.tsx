import {ReadTask, type ReadTaskProps} from "./ReadTask";
import {Alert, type AlertProps} from "./Alert";

interface UpdateTaskResponseProps {
  alert?: AlertProps;
  task?: ReadTaskProps;
}

export const UpdateTaskResponse = ({ alert, task }: UpdateTaskResponseProps) => {
  const alertHtml = alert ? Alert(alert) : '';
  const taskHtml = task ? ReadTask(task) : '';
  return `
    <div hx-swap-oob="beforeend:#alerts">
      ${alertHtml}
    </div>
    ${taskHtml}
  `;
};
