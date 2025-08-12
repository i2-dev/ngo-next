import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1>Custom Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <p>Please check the URL or return to the homepage.</p>
      <Link href="/">Go to Homepage</Link>
    </div>
  );
}
