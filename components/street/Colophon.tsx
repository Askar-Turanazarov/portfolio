import type { Dictionary } from "@/lib/dictionary";
import { site } from "@/content/site";

export function Colophon({ dict }: { dict: Dictionary }) {
  const t = dict.street.colophon;
  const city = site.location.split(",")[0];
  return (
    <footer className="g colo">
      <div className="in">
        <div>
          <p>
            <b>{site.name}</b>, {city}
          </p>
          <p>
            <a href={site.github} target="_blank" rel="noopener noreferrer">
              github.com/{site.githubHandle}
            </a>
          </p>
          {site.email && <p>{site.email}</p>}
          {site.telegram && (
            <p>
              <a href={site.telegram} target="_blank" rel="noopener noreferrer">
                Telegram
              </a>
            </p>
          )}
        </div>
        <div>
          <p>{t.note}</p>
        </div>
        <div>
          <p>
            {t.textures}{" "}
            <a href="https://polyhaven.com/textures" target="_blank" rel="noopener noreferrer">
              Poly Haven
            </a>
            , {t.licence}.
          </p>
        </div>
      </div>
    </footer>
  );
}
