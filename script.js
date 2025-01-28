const dateToNZString = (dateStr) => {
  return new Date(dateStr).toLocaleString("en-US", {
    timeZone: "Pacific/Auckland",
  });
};

async function fetchComps() {
  try {
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Pacific/Auckland" })
    );
    now.setDate(now.getDate() - 2);
    now.setHours(0, 0, 0, 0);

    const thirtyDaysBeforeNow = new Date(now);
    thirtyDaysBeforeNow.setDate(now.getDate() - 30);

    const response = await fetch(
      "https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/competitions/NZ.json"
    );

    const data = await response.json();

    const upcoming = [];
    const current = [];
    const recent = [];

    for (const comp of data.items) {
      // from, to and thirtyDaysBefore for this comp
      const from = new Date(dateToNZString(comp.date.from));
      from.setHours(0, 0, 0, 0);
      const till = new Date(dateToNZString(comp.date.till));
      till.setHours(0, 0, 0, 0);

      // break if comp is past recent (comps are sorted in API)
      if (till < thirtyDaysBeforeNow) break;

      if (from > now) {
        upcoming.push(comp);
      } else if (from <= now && till >= now) {
        current.push(comp);
      } else if (till < now && till > thirtyDaysBeforeNow) {
        recent.push(comp);
      }
    }
    console.log(recent);

    return { upcoming, current, recent };
  } catch (error) {
    console.error(error);
  }
}

async function load() {
  const { upcoming, current, recent } = await fetchComps();

  console.log(upcoming, current, recent);
  if (current.length > 0) {
    document.getElementById("current").innerHTML = makeCompTable(
      "Current Competitions",
      current
    );
  }
  document.getElementById("upcoming").innerHTML = makeCompTable(
    "Upcoming Competitions",
    upcoming
  );
  document.getElementById("recent").innerHTML = makeCompTable(
    "Recent Competitions",
    recent
  );
}

function makeCompTable(title, comps) {
  const rows = comps.map((comp) => {
    const options = { month: "short", day: "numeric" };
    const from = new Date(comp.date.from).toLocaleDateString("en-US", options);
    const till = new Date(comp.date.till).toLocaleDateString("en-US", options);
    return `<tr>
        <td>${from === till ? from : from + " - " + till}</td>
        <td>${comp.name}</td>
        <td>${comp.city}</td>
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
