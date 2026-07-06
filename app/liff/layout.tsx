import { LiffProvider } from "./liff-provider";

export const metadata = {
  title: "EmpVee - Line",
  description: "HR Workflow on Line",
};

export default function LiffLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className="dark">
      <body className="min-h-screen bg-background text-foreground">
        <LiffProvider>{children}</LiffProvider>
      </body>
    </html>
  );
}
