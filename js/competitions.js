async function loadCompetitions() {
  const urlParams = new URLSearchParams(window.location.search);
  const dateParam = urlParams.get("date"); // "2025-01-28"

  const response = await fetch(
    "https://raw.githubusercontent.com/JackMaddigan/snz-comps-updater/main/competitions.json"
  );

  const comps = await response.json();

  const today = new Date(dateParam || Date.now())
    .toLocaleDateString("en-NZ", {
      timeZone: "Pacific/Auckland",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/")
    .reverse()
    .join("-");

  const current = [],
    upcoming = [],
    recent = [];

  for (const comp of comps.reverse()) {
    if (comp.date.from > today) {
      upcoming.push(comp);
    } else if (comp.date.till < today) {
      recent.push(comp);
    } else {
      current.push(comp);
    }
  }

  // now make the tables

  // header row to use for all of the tables
  const upcomingTable = makeTable(upcoming, "Upcoming", "upcoming");
  document.getElementById("upcoming-box").innerHTML = upcomingTable;

  const recentTable = makeTable(recent, "Recent", "recent");
  document.getElementById("recent-box").innerHTML = recentTable;

  const currentTable = makeTable(current, "Current", "current");
  if (current.length)
    document.getElementById("current-box").innerHTML = currentTable;
}

function dateToShort(dateString) {
  // param: yyyy-mm-dd
  return new Date(dateString).toLocaleDateString("en-US", {
    timeZone: "Pacific/Auckland",
    day: "numeric",
    month: "short", // Abbreviated month (e.g., "Feb")
  });
}

function makeTable(comps, title, tableClass) {
  return `
  <h1>${title} Competitions</h1>
  <table class="comp-table ${tableClass}">
    <thead>
      <tr>
        <th>Date</th>
        <th>Competition</th>
        <th>Location</th>
      </tr>
    </thead>
    <tbody>
    ${comps.map((comp) => makeCompRow(comp, title)).join("")}
    </tbody>
  </table>
  `;
}

function makeCompRow(comp, title) {
  // prettier-ignore
  const eventOrder = ["333", "222", "444", "555", "666", "777", "333bf", "333fm", "333oh", "clock", "minx", "pyram", "skewb", "sq1", "444bf", "555bf", "333mbf"]
  return `
    <tr>
      <td>
        ${dateToShort(comp.date.from)}${
    comp.date.from === comp.date.till ? "" : `-${dateToShort(comp.date.till)}`
  }
      </td>
      <td>
        <a class="comp-name" href="https://www.worldcubeassociation.org/competitions/${
          comp.id
        }" target="blank">${
    comp.name
  }</a><div class="event-icons-row">${comp.events
    .sort((a, b) => eventOrder.indexOf(a) - eventOrder.indexOf(b))
    .map((event) => `<span class="cubing-icon event-${event}"></span>`)
    .join("")}</div>${makeAdditionalCompInfo(comp, title)}
      </td>
      
      <td>
        <a href="https://www.google.com/maps?q=${
          comp.venue.coordinates.latitude
        },${comp.venue.coordinates.longitude}
" class="venue-name">${extractVenueName(
    comp.venue.name
  )}</a><br><h5 class="city-name"><i>${comp.city}</i></h5></td>
      </tr>  
  `;
}

function makeAdditionalCompInfo(comp, title) {
  const dateDisplayOptions = [
    "en-US",
    {
      month: "short", // "May"
      day: "numeric", // "12"
      hour: "numeric", // "6"
      minute: "numeric", // "00"
      hour12: true, // Use 12-hour clock with AM/PM
    },
  ];

  if (title === "Upcoming") {
    const now = Date.now();
    const regOpens = new Date(comp.registration_open);
    const regCloses = new Date(comp.registration_close);
    const regMessage =
      regCloses < now
        ? `Registration is closed`
        : regOpens <= now
        ? `Register now until ${regCloses.toLocaleDateString(
            ...dateDisplayOptions
          )}`
        : `Registration opens ${regOpens.toLocaleDateString(
            ...dateDisplayOptions
          )}`;
    return `<a class="reg-link" href="https://www.worldcubeassociation.org/competitions/${comp.id}/register" target="blank">${regMessage}</a>`;
  } else if (title === "Current") {
    return `<button class="action-btn" onclick="window.open('https://www.competitiongroups.com/competitions/${comp.id}', '_blank')">Groups</button> <button class="action-btn" onclick="window.open('https://live.worldcubeassociation.org/link/competitions/${comp.id}', '_blank')">Live Results</button>`;
  }
  return "";
}

function extractVenueName(str) {
  if (str.includes("]")) {
    const name = str.split("]")[0].replace(/[\(\)\[\]\{\}]/g, "");
    return name;
  }
  return str;
}
