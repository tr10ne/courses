import React from "react";
import { Head, Link } from "@inertiajs/inertia-react";

export default function Index({ subcategories }) {
    return (
        <div>
            <Head title="Subcategories" />
            <h1>Subcategories</h1>
            <Link
                href={route("subcategories.create")}
                className="btn btn-primary"
            >
                Create New Subcategory
            </Link>
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {subcategories.map((subcategory) => (
                        <tr key={subcategory.id}>
                            <td>{subcategory.id}</td>
                            <td>{subcategory.name}</td>
                            <td>{subcategory.category.name}</td>
                            <td>
                                <Link
                                    href={route(
                                        "subcategories.show",
                                        subcategory.id
                                    )}
                                    className="btn btn-info btn-sm"
                                >
                                    Show
                                </Link>
                                <Link
                                    href={route(
                                        "subcategories.edit",
                                        subcategory.id
                                    )}
                                    className="btn btn-warning btn-sm ms-2"
                                >
                                    Edit
                                </Link>
                                <Link
                                    method="delete"
                                    href={route(
                                        "subcategories.destroy",
                                        subcategory.id
                                    )}
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
