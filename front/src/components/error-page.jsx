import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      {error && error.statusText && (
        <p>
          <i>{error.statusText}</i>
        </p>
      )}
      {error && error.message && (
        <p>
          <i>{error.message}</i>
        </p>
      )}
    </div>
  );
}
