import React from "react";
import { Head, Link } from "@inertiajs/inertia-react";

export default function Index({ reviews }) {
    return (
        <div>
            <Head title="Reviews" />
            <h1>Reviews</h1>
            <Link href={route("reviews.create")} className="btn btn-primary">
                Create New Review
            </Link>
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Text</th>
                        <th>Rating</th>
                        <th>User</th>
                        <th>Approved</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((review) => (
                        <tr key={review.id}>
                            <td>{review.id}</td>
                            <td>{review.text_review}</td>
                            <td>{review.rating}</td>
                            <td>{review.user.name}</td>
                            <td>{review.approved ? "Yes" : "No"}</td>
                            <td>
                                <Link
                                    href={route("reviews.show", review.id)}
                                    className="btn btn-info btn-sm"
                                >
                                    Show
                                </Link>
                                <Link
                                    href={route("reviews.edit", review.id)}
                                    className="btn btn-warning btn-sm ms-2"
                                >
                                    Edit
                                </Link>
                                <Link
                                    method="delete"
                                    href={route("reviews.destroy", review.id)}
                                    className="btn btn-danger btn-sm ms-2"
                                    as="button"
                                >
                                    Delete
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
