import { allLectures } from "contentlayer/generated";

export function GET() {
    return Response.json(allLectures)
}