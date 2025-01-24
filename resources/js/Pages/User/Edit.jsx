import React from "react";
import { Head, Link, useForm } from "@inertiajs/inertia-react";

export default function Edit({ user, roles }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: "",
        role_id: user.role_id,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("users.update", user.id));
    };

    return (
        <div>
            <Head title={`Edit ${user.name}`} />
            <h1>Edit User</h1>
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
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className={`form-control ${
                            errors.email ? "is-invalid" : ""
                        }`}
                    />
                    {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        className={`form-control ${
                            errors.password ? "is-invalid" : ""
                        }`}
                    />
                    {errors.password && (
                        <div className="invalid-feedback">
                            {errors.password}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="role_id" className="form-label">
                        Role
                    </label>
                    <select
                        id="role_id"
                        value={data.role_id}
                        onChange={(e) => setData("role_id", e.target.value)}
                        className={`form-control ${
                            errors.role_id ? "is-invalid" : ""
                        }`}
                    >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.role_name}
                            </option>
                        ))}
                    </select>
                    {errors.role_id && (
                        <div className="invalid-feedback">{errors.role_id}</div>
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
                    href={route("users.index")}
                    className="btn btn-secondary ms-2"
                >
                    Cancel
                </Link>
            </form>
        </div>
    );
}
