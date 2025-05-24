import { ReadTask, ReadTaskProps } from "./ReadTask";
import { Alert, AlertProps } from "./Alert";

interface CreateSuccessProps {
    task: ReadTaskProps;
    alert: AlertProps;
}

export const CreateSuccess = ({ task, alert }: CreateSuccessProps) => {
    return (
        <>
            <Alert {...alert} />
            <ReadTask {...task} />
        </>
    );
};