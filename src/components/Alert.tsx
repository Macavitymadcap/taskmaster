type AlertType = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

export interface AlertProps {
    type: AlertType;
    title: string;
    message: string;
    outOfBounds: boolean;
    id?: string;
    manuallyDismissible?: boolean;
    autoDismiss?: boolean;
}

export const Alert = ({ 
    type, 
    title, 
    message, 
    outOfBounds, 
    id, 
    manuallyDismissible, 
    autoDismiss 
}: AlertProps) => {
    const props: { [key: string]: string } = {
        class: `alert alert-${type}`,
        role: 'alert',
        'x-ref': 'alert',
        'x-init': autoDismiss ? `setTimeout(() => { $el.remove(); }, 5000)` : '',
        'aria-live': autoDismiss ? 'polite' : 'assertive'
    };

    if (outOfBounds) {
        props['hx-swap-oob'] = 'true';
    }

    if (id) {
        props.id = id;
    }

    return (
        <div {...props}>
            <strong>{title}</strong> {message}
            {manuallyDismissible && (
                <button 
                    type="button" 
                    class="btn btn-icon btn-outline" 
                    title="Close" 
                    aria-label="Close"
                    x-on:click="$refs.alert.remove()"
                >
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M6 18L18 6"></path>
                        <path d="M6 6l12 12"></path>
                    </svg>
                </button>
            )}
        </div>
    );
}
