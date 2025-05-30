import { Alert, AlertProps } from "../organisms";
import { UpdateTaskForm, UpdateTaskFormProps } from "../forms";

interface GetUpdateFormResponseProps {
  alert?: AlertProps;
  form?: UpdateTaskFormProps;
}

export const GetUpdateTaskFormResponse = ({
  alert,
  form,
}: GetUpdateFormResponseProps) => {
  const alertHtml = alert ? Alert(alert) : "";
  const formHtml = form ? UpdateTaskForm(form) : "";
  return `
    <div hx-swap-oob="beforeend:#alerts">
      ${alertHtml}
    </div>
      ${formHtml}
  `;
};
