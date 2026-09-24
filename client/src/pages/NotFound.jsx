import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { AlertIcon } from '../components/icons';

export default function NotFound() {
    return (
        <div className="page">
            <EmptyState
                icon={<AlertIcon width={26} height={26} />}
                title="Page not found"
                description="That page has moved on to next season. Let's get you back to the collection."
                action={
                    <Link className="btn btn--primary" to="/">
                        Back to the shop
                    </Link>
                }
            />
        </div>
    );
}
