/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(q) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  try {
    const url = `http://api.tvmaze.com/search/shows`;
    const res = await axios.get(url, { params: { q } });
    const data = [];
    const defaultImage = "https://tinyurl.com/tv-missing";
    for (let tvshow of res.data) {
      const show = tvshow.show;
      const showInfo = {
        id: show.id,
        name: show.name,
        summary: show.summary,
        image: show.image ? show.image.medium : defaultImage,
      };
      data.push(showInfo);
    }
    return data;
  } catch (e) {
    alert("SHOW NOT FOUND!");
  }
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button type="button" class="btn btn-lg btn-primary d-block mx-auto episodes-btn">Episodes</button>
           </div>
           
         </div>
       </div>
      `
    );

    $showsList.append($item);
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  // TODO: return array-of-episode-info, as described in docstring above

  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  const episodes = res.data.map((episode) => {
    let { id, name, season, number } = episode;
    return { id, name, season, number };
  });

  return episodes;
}

function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
  for (let episode of episodes) {
    let $item = $(
      `<li>${episode.name} (season ${episode.season}, number ${episode.number}</li>`
    );
    $episodesList.append($item);
  }
  const $episodesArea = $("#episodes-area");
  $episodesArea.show();
}

$("#shows-list").on("click", ".episodes-btn", async function (event) {
  const showId = $(this).closest("*[data-show-id]").data("show-id");
  const episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});
