import { 
  Alert, 
  type AlertProps,
  ReadTask, 
  type ReadTaskProps,
} from "../organisms";

interface GetTaskByIDResponseProps {
  alert?: AlertProps;
  task?: ReadTaskProps;
}

export const GetTaskByIDResponse = ({
  alert,
  task,
}: GetTaskByIDResponseProps) => {
  const alertHtml = alert ? Alert(alert) : "";
  const taskHtml = task ? ReadTask(task) : "";
  return `
    <div hx-swap-oob="beforeend:#alerts">
      ${alertHtml}
    </div>
    ${taskHtml}
  `;
};
