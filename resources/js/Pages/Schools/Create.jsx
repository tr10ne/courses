import React from "react";
import { Head, Link, useForm } from "@inertiajs/inertia-react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        description: "",
        link: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("schools.store"));
    };

    return (
        <div>
            <Head title="Create School" />
            <h1>Create New School</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className={`form-control ${
                            errors.name ? "is-invalid" : ""
                        }`}
                    />
                    {errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        className={`form-control ${
                            errors.description ? "is-invalid" : ""
                        }`}
                    />
                    {errors.description && (
                        <div className="invalid-feedback">
                            {errors.description}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="link" className="form-label">
                        Link
                    </label>
                    <input
                        type="url"
                        id="link"
                        value={data.link}
                        onChange={(e) => setData("link", e.target.value)}
                        className={`form-control ${
                            errors.link ? "is-invalid" : ""
                        }`}
                    />
                    {errors.link && (
                        <div className="invalid-feedback">{errors.link}</div>
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
                    href={route("schools.index")}
                    className="btn btn-secondary ms-2"
                >
                    Cancel
                </Link>
            </form>
        </div>
    );
}
