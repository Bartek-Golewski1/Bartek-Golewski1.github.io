create table song
(
    id      integer not null
        constraint song_pk
            primary key autoincrement,
    title   text not null,
    artist  text not null,
    content text not null
);