import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notFound } from "next/navigation";
import { format } from "date-fns";

// This tells Next.js to dynamically render this page on request
export const dynamic = "force-dynamic";

export default async function CMSPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let pageData = null;

  try {
    const docRef = doc(db, "pages", slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      pageData = docSnap.data();
    } else {
      notFound();
    }
  } catch (error) {
    console.error("Error fetching page:", error);
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container px-4 md:px-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border p-8 md:p-12">
          
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{pageData?.title}</h1>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-4"></div>
            {pageData?.updatedAt && (
              <p className="text-sm text-slate-500 italic">
                Cập nhật lần cuối: {format(pageData.updatedAt.toDate(), "dd/MM/yyyy")}
              </p>
            )}
          </div>

          <div 
            className="prose prose-slate prose-lg max-w-none 
                       prose-headings:text-slate-900 prose-headings:font-bold
                       prose-a:text-primary hover:prose-a:text-primary/80
                       prose-img:rounded-xl prose-img:shadow-sm"
            dangerouslySetInnerHTML={{ __html: pageData?.content || "" }}
          />
          
        </div>
      </div>
    </div>
  );
}
