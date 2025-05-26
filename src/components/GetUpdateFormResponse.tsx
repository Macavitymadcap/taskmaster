import { Alert, AlertProps } from "./Alert";
import { UpdateForm, UpdateFormProps } from "./UpdateTaskForm";

interface GetUpdateFormResponseProps {
  alert?: AlertProps;
  form?: UpdateFormProps;
}

export const GetUpdateFormResponse = ({
  alert,
  form,
}: GetUpdateFormResponseProps) => {
  const alertHtml = alert ? Alert(alert) : "";
  const formHtml = form ? UpdateForm(form) : "";
  return `
    <div hx-swap-oob="beforeend:#alerts">
      ${alertHtml}
    </div>
      ${formHtml}
  `;
};
