import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider, useTheme } from "@/lib/theme";
import appCss from "../styles.css?url";

const APP_NAME = "Soccer Scouting";

const fetchSessionUser = createServerFn({ method: "GET" }).handler(async () => {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  const u = await getSessionUser();
  return u ? { id: u.id, email: u.email } : null;
});

export const Route = createRootRoute({
  beforeLoad: async () => ({ sessionUser: await fetchSessionUser() }),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "description", content: "From the pitch to the club — Asia's football scouting platform" },
      { name: "theme-color", content: "#0b0d0c" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Vazirmatn:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: RootDocument,
});

function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster theme={theme} position="bottom-center" />;
}

function RootDocument() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <html suppressHydrationWarning className="antialiased">
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var rtl={fa:1,ar:1,ur:1,ku:1};var html={ku:"ckb"};var l=localStorage.getItem("kavosh-locale");if(!l){var n=(navigator.language||"").toLowerCase();if(n.indexOf("fa")===0||n.indexOf("ps")===0||n.indexOf("tg")===0)l="fa";else if(n.indexOf("ar")===0)l="ar";else if(n.indexOf("tr")===0)l="tr";else if(n.indexOf("az")===0)l="az";else if(n.indexOf("ur")===0)l="ur";else if(n.indexOf("ku")===0||n.indexOf("ckb")===0)l="ku";else if(n.indexOf("en")===0)l="en";else l="fa";}var d=document.documentElement;d.lang=html[l]||l;d.dir=rtl[l]?"rtl":"ltr";d.dataset.locale=l;var t=localStorage.getItem("kavosh-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}d.dataset.theme=t;d.classList.toggle("dark",t==="dark");d.classList.toggle("light",t==="light");}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <PreviewHostBridge />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider>
              <I18nProvider>
                <Outlet />
                <ThemedToaster />
              </I18nProvider>
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
