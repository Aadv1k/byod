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

export async function GET(req) {
    const url = new URL(req.url);
    const query = url.searchParams.get("q") || url.params.get("query")

    if (!query || query.length === 0) {
        return errorResponse(errors.badReq, "expected query param `q`");
    }


    const matches = await search(query);
    return NextResponse.json(matches);
}

