import { Alert, type AlertProps } from "../organisms";
import { DeleteTaskForm, type DeleteTaskFormProps } from "../forms";

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
