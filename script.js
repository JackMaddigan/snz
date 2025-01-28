const dateToNZString = (dateStr) => {
  return new Date(dateStr).toLocaleString("en-US", {
    timeZone: "Pacific/Auckland",
  });
};

const openInNew = `<span class="material-icons small-icon">open_in_new</span>`;

async function fetchComps() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get("date"); // "2025-01-28"
    const now = new Date(
      dateParam ||
        new Date().toLocaleString("en-US", {
          timeZone: "Pacific/Auckland",
        })
    );
    now.setHours(0, 0, 0, 0);

    const response = await fetch(
      "https://raw.githubusercontent.com/JackMaddigan/snz-comps-updater/main/competitions.json"
    );

    const data = await response.json();

    const upcoming = [];
    const current = [];
    const recent = [];

    for (const comp of data) {
      // from, to and thirtyDaysBefore for this comp
      const from = new Date(dateToNZString(comp.date.from));
      from.setHours(0, 0, 0, 0);
      const till = new Date(dateToNZString(comp.date.till));
      till.setHours(0, 0, 0, 0);

      if (from > now) {
        upcoming.push(comp);
      } else if (from <= now && till >= now) {
        current.push(comp);
      } else if (till < now) {
        recent.push(comp);
      }
    }

    upcoming.reverse();

    return { upcoming, current, recent };
  } catch (error) {
    console.error(error);
  }
}

async function load() {
  const { upcoming, current, recent } = await fetchComps();

  if (current.length > 0) {
    document.getElementById("current").innerHTML = makeCompTable(
      "Current Competitions",
      current,
      false,
      true
    );
  }
  document.getElementById("upcoming").innerHTML = makeCompTable(
    "Upcoming Competitions",
    upcoming,
    true
  );
  document.getElementById("recent").innerHTML = makeCompTable(
    "Recent Competitions",
    recent
  );
}

function makeCompTable(title, comps, showReg = false, showButtonRow = false) {
  const rows = comps.map((comp) => {
    const options = { month: "short", day: "numeric" };
    const from = new Date(comp.date.from).toLocaleDateString("en-US", options);
    const till = new Date(comp.date.till).toLocaleDateString("en-US", options);
    const regLink = makeRegLink(showReg, comp);
    const buttonRow = makeButtonRow(showButtonRow, comp);

    return `<tr>
        <td>${from === till ? from : from + " - " + till}</td>
        <td><a class="comp-name" href="https://www.worldcubeassociation.org/competitions/${
          comp.id
        }" target="blank">${
      comp.name
    } ${openInNew}</a><br><div class="icon-row">${comp.events
      .map((event) => `<span class="cubing-icon event-${event}"></span>`)
      .join(" ")}</div>${regLink}${buttonRow}</td>
        <td><a href="https://www.google.com/maps?q=${
          comp.venue.coordinates.latitude
        },${comp.venue.coordinates.longitude}
" class="venue-name">${extractVenueName(
      comp.venue.name
    )} ${openInNew}</a><br><h5 class="city-name"><i>${comp.city}</i></h5></td>
      </tr>`;
  });

  return `<h2>${title}</h2><table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Competition</th>
        <th>Venue</th>
      </tr>
    </thead>
    <tbody>
      ${rows.join("\n")}
    </tbody>
  </table>`;
}

function makeRegLink(showRegLink, comp) {
  if (!showRegLink) return "";

  const dateDisplayOptions = {
    month: "short", // "May"
    day: "numeric", // "12"
    hour: "numeric", // "6"
    minute: "numeric", // "00"
    hour12: true, // Use 12-hour clock with AM/PM
  };

  const regOpens = new Date(dateToNZString(comp.registration_open));
  const regCloses = new Date(dateToNZString(comp.registration_close));
  const now = Date.now();
  const regMessage =
    regOpens > now
      ? `Registration opens ${regOpens.toLocaleString(
          "en-US",
          dateDisplayOptions
        )} ${openInNew}`
      : regCloses > now
      ? `Register now until ${regCloses.toLocaleString(
          "en-US",
          dateDisplayOptions
        )} ${openInNew}`
      : `Registration is closed`;

  return `<a class="reg-link reg-link" href="https://www.worldcubeassociation.org/competitions/${comp.id}/register" target="blank">${regMessage}</a>`;
}

function extractVenueName(str) {
  if (str.includes("]")) {
    const name = str.split("]")[0].replace(/[\(\)\[\]\{\}]/g, "");
    return name;
  }
  return str;
}

function makeButtonRow(showButtonRow, comp) {
  if (!showButtonRow) return "";
  const row = `<button class="action-btn" onclick="window.open('https://www.competitiongroups.com/competitions/${comp.id}', '_blank')">Groups</button> <button class="action-btn" onclick="window.open('https://live.worldcubeassociation.org', '_blank')">Live Results</button>`;
  return row;
}
