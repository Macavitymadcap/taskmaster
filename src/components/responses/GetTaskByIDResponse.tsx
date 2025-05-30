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
  return (
    <>
      {alert && <Alert {...alert} />}
      {task && <ReadTask {...task} />}
    </>
  );
};
