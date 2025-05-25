import { ReadTask, type ReadTaskProps } from "./ReadTask";
import { Alert, type AlertProps } from "./Alert";

interface GetTaskByIDResponseProps {
  alert?: AlertProps;
  task?: ReadTaskProps;
}

export const GetTaskByIDResponse = ({
  alert,
  task,
}: GetTaskByIDResponseProps) => {
  return (
    <>
      {alert && <Alert {...alert} />}
      {task && <ReadTask {...task} />}
    </>
  );
};
