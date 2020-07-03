/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async, so it
 *       will be returning a promise.
 *
 */
// Given a search term, make ajax request to the show search api endpoint
// return an array of tv show objects. Each object includes the following show information:
//      { id: <show id>,
//        name: <show name>,
//        summary: <show summary>,
//        image: <an image from the show data, or a default image if no image exists, (image isn't needed until later)>
//       }
async function searchShows(q) {
  try {
    const url = `http://api.tvmaze.com/search/shows`;
    const res = await axios.get(url, { params: { q } });
    const shows = [];
    // return this default image if an image is not returned for the show
    const defaultImage = "https://tinyurl.com/tv-missing";
    for (let tvshow of res.data) {
      const show = tvshow.show;
      const showInfo = {
        id: show.id,
        name: show.name,
        summary: show.summary,
        image: show.image ? show.image.medium : defaultImage,
      };
      shows.push(showInfo);
    }
    return shows;
  } catch (e) {
    alert("SHOW NOT FOUND!");
  }
}

// given an array of show objects, add shows to the DOM
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

// Handle search form submission
// when search term is submitted, hide the episodes area and add the shows to the DOM
$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

// given a show ID, make ajax get request to shows/id/episodes endpoint and return array of episode objects
// each episode object will have keys:
// { id, name, season, number }
async function getEpisodes(id) {
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  const episodes = res.data.map((episode) => {
    let { id, name, season, number } = episode;
    return { id, name, season, number };
  });

  return episodes;
}

// given an array of episode objects, add episode data to the list in the DOM
function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
  for (let episode of episodes) {
    let $item = $(
      `<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>`
    );
    $episodesList.append($item);
  }
  const $episodesArea = $("#episodes-area");
  $episodesArea.show();
}

// Handle clicks on Episode button below show info to add episode information to the DOM
$("#shows-list").on("click", ".episodes-btn", async function (event) {
  const showId = $(this).closest("*[data-show-id]").data("show-id");
  const episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});
