import Link from "next/link";
export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Page not found</h1>
        <p className="mt-2 text-muted-foreground">The page you’re looking for doesn’t exist.</p>
        <Link href="/" className="inline-block mt-6 underline">Go back home</Link>
      </div>
    </main>
  );
}
