import React from "react";
import { Head, Link } from "@inertiajs/inertia-react";

export default function Show({ user }) {
    return (
        <div>
            <Head title={user.name} />
            <h1>{user.name}</h1>
            <p>Email: {user.email}</p>
            <p>Role: {user.role.role_name}</p>
            <Link href={route("users.index")} className="btn btn-secondary">
                Back to Users
            </Link>
        </div>
    );
}
