import React from "react";
import { Head, Link } from "@inertiajs/inertia-react";

export default function Show({ course }) {
    return (
        <div>
            <Head title={course.name} />
            <h1>{course.name}</h1>
            <p>Subcategory: {course.subcategory.name}</p>
            <p>School: {course.school.name}</p>
            <p>Description: {course.description}</p>
            <p>Price: ${course.price}</p>
            <p>
                Link:{" "}
                <a href={course.link} target="_blank" rel="noopener noreferrer">
                    {course.link}
                </a>
            </p>
            <p>
                More Info:{" "}
                <a
                    href={course.link_more}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {course.link_more}
                </a>
            </p>
            <Link href={route("courses.index")} className="btn btn-secondary">
                Back to Courses
            </Link>
        </div>
    );
}
