import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect } from 'react';

import styles from '@/styles/Home.module.css';
import useDebounce from '@/hooks/useDebounce';

export interface Notice {
  forename: string;
  date_of_birth: string;
  entity_id: string;
  nationalities: string[];
  name: string;
  _links: Links;
}

export interface Links {
  self: Images;
  images: Images;
  thumbnail: Images;
}

export interface Images {
  href: string;
}

export default function Home() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [search, setSearch] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setNotices([]);

      const data = await fetch(`https://ws-public.interpol.int/notices/v1/red?forename=${debouncedSearch}&resultPerPage=200`)
        .then((res) => res.json());
      setNotices(data._embedded.notices);
      setLoading(false);
    }

    if (debouncedSearch) fetchData();
  }, [debouncedSearch]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <input
          type="search"
          placeholder="Search"
          onChange = {(e) => setSearch(e.target.value)}
        />
        {loading && <p>Loading...</p>}
        {notices.map((notice) => {
          return (
            <div key={notice.entity_id} className={styles.notice}>
              {notice._links?.thumbnail?.href && (
                <Image
                  src={notice._links.thumbnail.href}
                  width={100}
                  height={100}
                  alt={notice.name}
                />
              )}
              <div className={styles.notice_body}>
                <p>
                  {notice.forename} {notice.name}
                </p>
                <p>{notice.date_of_birth}</p>
              </div>
            </div>
          );
        })}
      </main>
    </>
  )
}
