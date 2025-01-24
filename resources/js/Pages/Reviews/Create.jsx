import React from "react";
import { Head, Link, useForm } from "@inertiajs/inertia-react";

export default function Create({ users }) {
    const { data, setData, post, processing, errors } = useForm({
        text_review: "",
        rating: "",
        id_user: "",
        approved: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("reviews.store"));
    };

    return (
        <div>
            <Head title="Create Review" />
            <h1>Create New Review</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="text_review" className="form-label">
                        Text
                    </label>
                    <textarea
                        id="text_review"
                        value={data.text_review}
                        onChange={(e) => setData("text_review", e.target.value)}
                        className={`form-control ${
                            errors.text_review ? "is-invalid" : ""
                        }`}
                    />
                    {errors.text_review && (
                        <div className="invalid-feedback">
                            {errors.text_review}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="rating" className="form-label">
                        Rating
                    </label>
                    <input
                        type="number"
                        id="rating"
                        value={data.rating}
                        onChange={(e) => setData("rating", e.target.value)}
                        className={`form-control ${
                            errors.rating ? "is-invalid" : ""
                        }`}
                        min="1"
                        max="5"
                    />
                    {errors.rating && (
                        <div className="invalid-feedback">{errors.rating}</div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="id_user" className="form-label">
                        User
                    </label>
                    <select
                        id="id_user"
                        value={data.id_user}
                        onChange={(e) => setData("id_user", e.target.value)}
                        className={`form-control ${
                            errors.id_user ? "is-invalid" : ""
                        }`}
                    >
                        <option value="">Select User</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                    {errors.id_user && (
                        <div className="invalid-feedback">{errors.id_user}</div>
                    )}
                </div>
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        id="approved"
                        checked={data.approved}
                        onChange={(e) => setData("approved", e.target.checked)}
                        className={`form-check-input ${
                            errors.approved ? "is-invalid" : ""
                        }`}
                    />
                    <label htmlFor="approved" className="form-check-label">
                        Approved
                    </label>
                    {errors.approved && (
                        <div className="invalid-feedback">
                            {errors.approved}
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={processing}
                >
                    {processing ? "Creating..." : "Create"}
                </button>
                <Link
                    href={route("reviews.index")}
                    className="btn btn-secondary ms-2"
                >
                    Cancel
                </Link>
            </form>
        </div>
    );
}
