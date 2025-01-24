import React from "react";
import { Head, Link } from "@inertiajs/inertia-react";

export default function Index({ schools }) {
    return (
        <div>
            <Head title="Schools" />
            <h1>Schools</h1>
            <Link href={route("schools.create")} className="btn btn-primary">
                Create New School
            </Link>
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {schools.map((school) => (
                        <tr key={school.id}>
                            <td>{school.id}</td>
                            <td>{school.name}</td>
                            <td>{school.description}</td>
                            <td>
                                <Link
                                    href={route("schools.show", school.id)}
                                    className="btn btn-info btn-sm"
                                >
                                    Show
                                </Link>
                                <Link
                                    href={route("schools.edit", school.id)}
                                    className="btn btn-warning btn-sm ms-2"
                                >
                                    Edit
                                </Link>
                                <Link
                                    method="delete"
                                    href={route("schools.destroy", school.id)}
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
