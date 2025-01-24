import React from "react";
import { Head, Link } from "@inertiajs/inertia-react";

export default function Index({ courses }) {
    return (
        <div>
            <Head title="Courses" />
            <h1>Courses</h1>
            <Link href={route("courses.create")} className="btn btn-primary">
                Create New Course
            </Link>
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Subcategory</th>
                        <th>School</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.id}>
                            <td>{course.id}</td>
                            <td>{course.name}</td>
                            <td>{course.subcategory.name}</td>
                            <td>{course.school.name}</td>
                            <td>
                                <Link
                                    href={route("courses.show", course.id)}
                                    className="btn btn-info btn-sm"
                                >
                                    Show
                                </Link>
                                <Link
                                    href={route("courses.edit", course.id)}
                                    className="btn btn-warning btn-sm ms-2"
                                >
                                    Edit
                                </Link>
                                <Link
                                    method="delete"
                                    href={route("courses.destroy", course.id)}
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
