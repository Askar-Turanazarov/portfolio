/** Shown the moment a project link is clicked, in the same layout as the first screen of the page. */
export default function Loading() {
  return (
    <main className="case cs-wait" aria-busy="true">
      <div className="g pbar">
        <div className="in" />
      </div>
      <section className="g cs-hero">
        <div className="in">
          <div className="cs-lead">
            <div className="cs-bone a" />
            <div className="cs-bone b" />
            <div className="cs-bone c" />
          </div>
          <div className="cs-bone d" />
        </div>
      </section>
    </main>
  );
}
