import { Fragment, useEffect } from "react";
import { GetStaticProps } from "next";
import { api } from "../services/api";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import styles from "./home.module.scss";

type PropsEpisodeType = {
  id: string;
  title: string;
  members: string;
  description: string;
  thumbnail: string;
  url: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
};

type PropsHomeType = {
  latestEpisodes: PropsEpisodeType[];
  allEpisodes: PropsEpisodeType[];
};

export default function Home(props: PropsHomeType) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {props.latestEpisodes.map((episode) => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetail}>
                  <a href="">{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>PODCAST</th>
              <th>INTEGRANTES</th>
              <th>DATA</th>
              <th>DURAÇÃO</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {props.allEpisodes.map((episode) => {
              return (
                <tr key={episode.id}>
                  <td>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>{episode.title}</td>
                  <td>{episode.members}</td>
                  <td>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
      description: episode.description,
      url: episode.file.url,
    };
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes: latestEpisodes,
      allEpisodes: allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
