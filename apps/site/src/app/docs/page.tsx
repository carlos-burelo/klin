import { redirect } from "next/navigation";

/** /docs vive en /docs/overview (misma chrome que el resto de docs). */
export default function DocsIndex() {
  redirect("/docs/overview");
}
