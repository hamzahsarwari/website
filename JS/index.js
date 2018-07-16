window.onload = () => {
  const loading_id = '#loading'
  const loading_block = document.querySelector(loading_id);

  Music(
    music => fade(loading_block, () => ShowMusic(music)),
    err => fade(loading_block, () => console.log('faded with error'))
  );
}

function fade(e, then) {
  let opacity = 1;
  const timer = setInterval(() => {
    if (opacity <= 0.1) {
      clearInterval(timer)
      e.style.display = 'none';
      then();
    }
    e.style.opacity = opacity;
    e.style.filter = `alpha(opacity=${opacity * 100})`
    opacity -= opacity * 0.09;
  }, 100)
}

function ShowMusic(music) {
  const tracks = music.recenttracks.track.slice(0, 12);
  const music_div = document.querySelector(".music");
  let songs = ''
  tracks.forEach(song => {
    const url = song.url;
    const image = song.image[0]["#text"]
    const name = song.name
    const artist = song.artist['#text'];
    const description = `${name} by ${artist}`
    if (image) {
      songs += `
      <a href="${url}">
        <img class="music-block"
             src="${image}"
             alt="${name}"
             title="${description}" />
      </a>`
    } else {
      songs += `
      <a class="music-block" title="${description}" href="${url}"></a>`
    }
  });
  music_div.innerHTML = songs;
  music_div.classList.add("music-done");
}

function Music(callback, err) {
  getTracks(
    music => callback(music),
    e => { err(); console.log('error'); }
  );
  function getTracks(fn, e) {
    // ok like my api key is public. deal w it :)
    const url_api_key = "api_key=99b3bff8e3eb1ef3d73429f2123f7e4d";
    const url_format = "format=json";
    const url_user = "user=isthisnagee";
    const url_method = "method=user.getrecenttracks";
    const url_api_base = "https://ws.audioscrobbler.com/2.0";
    const recent_tracks_url = `${url_api_base}/?${url_method}&${url_user}&${url_api_key}&${url_format}`;
    return fetch(recent_tracks_url)
      .then(response => response.json())
      .then(json => fn(json))
      .catch(() => e());
  }
}

