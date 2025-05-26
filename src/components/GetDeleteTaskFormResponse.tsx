import { Alert, type AlertProps } from "./Alert";
import { DeleteTaskForm, type DeleteTaskFormProps } from "./DeleteTaskForm";

interface GetDeleteTaskFormResponseProps {
  alert?: AlertProps;
  form?: DeleteTaskFormProps;
}

export const GetDeleteTaskFormResponse = ({
  alert,
  form,
}: GetDeleteTaskFormResponseProps) => {
  const alertHtml = alert ? Alert(alert) : "";
  const formHtml = form ? DeleteTaskForm(form) : "";
  return `
    <div hx-swap-oob="beforeend:#alerts">
      ${alertHtml}
    </div>
    ${formHtml}
  `;
};

export type { GetDeleteTaskFormResponseProps };
