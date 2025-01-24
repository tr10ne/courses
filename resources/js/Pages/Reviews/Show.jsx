import React from "react";
import { Head, Link } from "@inertiajs/inertia-react";

export default function Show({ review }) {
    return (
        <div>
            <Head title={`Review by ${review.user.name}`} />
            <h1>Review by {review.user.name}</h1>
            <p>Text: {review.text_review}</p>
            <p>Rating: {review.rating}</p>
            <p>Approved: {review.approved ? "Yes" : "No"}</p>
            <Link href={route("reviews.index")} className="btn btn-secondary">
                Back to Reviews
            </Link>
        </div>
    );
}
