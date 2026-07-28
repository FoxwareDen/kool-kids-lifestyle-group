import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/dashboard/test-page")({
  validateSearch: ((search: Record<string, unknown>) => ({
    lang: (search.lang as "en" | "af") ?? undefined,
  })),
  loaderDeps: ({ search: { lang } }) => ({ lang }),
  loader: async () => {
    // TODO: ssf
  },
  component: RouteComponent
})

function RouteComponent() {

  const test = async () => {
  };

  return (
    <div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur ut pariatur esse, consectetur dolorum magni odio sit vitae. Commodi dolore est atque dignissimos voluptatibus cum animi velit obcaecati ut blanditiis!

      <button onClick={test}>test</button>
    </div>
  )
}
