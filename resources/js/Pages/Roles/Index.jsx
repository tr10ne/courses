import React from "react";
import { Head, Link } from "@inertiajs/inertia-react";

export default function Index({ roles }) {
    return (
        <div>
            <Head title="Roles" />
            <h1>Roles</h1>
            <Link href={route("roles.create")} className="btn btn-primary">
                Create New Role
            </Link>
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map((role) => (
                        <tr key={role.id}>
                            <td>{role.id}</td>
                            <td>{role.role_name}</td>
                            <td>
                                <Link
                                    href={route("roles.show", role.id)}
                                    className="btn btn-info btn-sm"
                                >
                                    Show
                                </Link>
                                <Link
                                    href={route("roles.edit", role.id)}
                                    className="btn btn-warning btn-sm ms-2"
                                >
                                    Edit
                                </Link>
                                <Link
                                    method="delete"
                                    href={route("roles.destroy", role.id)}
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
