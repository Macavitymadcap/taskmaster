import { 
  Alert, 
  type AlertProps,
  ReadTask, 
  type ReadTaskProps,
} from "../organisms";

interface UpdateTaskResponseProps {
  alert?: AlertProps;
  task?: ReadTaskProps;
}

export const UpdateTaskResponse = ({
  alert,
  task,
}: UpdateTaskResponseProps) => {
  const alertHtml = alert ? Alert(alert) : "";
  const taskHtml = task ? ReadTask(task) : "";
  return `
    <div hx-swap-oob="beforeend:#alerts">
      ${alertHtml}
    </div>
    ${taskHtml}
  `;
};
