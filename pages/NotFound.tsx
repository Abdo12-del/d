import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Compass } from "lucide-react";
import { Owl } from "@/components/Owl";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-[60dvh] items-center justify-center">
      <div className="card-soft max-w-md p-8 text-center sm:p-10">
        <span className="mx-auto -mt-16 mb-3 block w-fit rounded-full bg-gradient-to-l from-sky-500 to-sky-600 px-5 py-1.5 font-display text-lg font-extrabold text-white shadow-soft">
          404 🧭
        </span>
        <div className="mx-auto w-fit animate-float-y">
          <Owl size={130} pose="point" />
        </div>
        <h1 className="mt-3 font-display text-2xl font-extrabold text-sky-950">
          ضلّ الطريق معنا؟
        </h1>
        <p className="mx-auto mt-1.5 max-w-xs text-sm font-semibold leading-relaxed text-slate-400">
          لا مشكلة — البومة تعرف الطريق. عُد إلى مركز المهام وستجد كل شيء
          بانتظارك.
        </p>
        <Link
          to="/"
          className="press mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-sky-500 to-sky-600 px-6 py-2.5 font-display text-sm font-extrabold text-white shadow-soft transition hover:from-sky-600 hover:to-sky-700"
        >
          <Compass className="h-4 w-4" />
          العودة للمركز
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
