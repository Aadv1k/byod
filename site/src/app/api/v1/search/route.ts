import { NextResponse } from "next/server";

import search from "@byod/crawler";

const errors = {
    badReq: {
        code: "bad_request",
        status: 400,
    }
}

function errorResponse(error: any, details: string) {
    return NextResponse.json({
        ...error,
        message: details
    }, {
        status: error.status
    })
}

export function GET(req) {
    return errorResponse(errors.badReq, "expected query param `q`");
}

