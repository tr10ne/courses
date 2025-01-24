import React from "react";
import { Head, Link, useForm } from "@inertiajs/inertia-react";

export default function Edit({ role }) {
    const { data, setData, put, processing, errors } = useForm({
        role_name: role.role_name,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("roles.update", role.id));
    };

    return (
        <div>
            <Head title={`Edit ${role.role_name}`} />
            <h1>Edit Role</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="role_name" className="form-label">
                        Role Name
                    </label>
                    <input
                        type="text"
                        id="role_name"
                        value={data.role_name}
                        onChange={(e) => setData("role_name", e.target.value)}
                        className={`form-control ${
                            errors.role_name ? "is-invalid" : ""
                        }`}
                    />
                    {errors.role_name && (
                        <div className="invalid-feedback">
                            {errors.role_name}
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={processing}
                >
                    {processing ? "Updating..." : "Update"}
                </button>
                <Link
                    href={route("roles.index")}
                    className="btn btn-secondary ms-2"
                >
                    Cancel
                </Link>
            </form>
        </div>
    );
}
