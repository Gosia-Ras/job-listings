const jobList = document.querySelector(".job-listings");
const filtersDiv = document.querySelector(".filters");
let jsondata;
let activeFilters = [];

fetch("./data.json")
  .then((response) => response.json())
  .then((json) => {
    jsondata = json;
    renderJobListings(jsondata);
  })
  .catch((error) => console.error("Error fetching or parsing data:", error));

function renderJobListings(data) {
  jobList.innerHTML = "";

  data.forEach((obj) => {
    const li = document.createElement("li");
    Object.entries({
      "data-role": obj.role.toLowerCase(),
      "data-level": obj.level.toLowerCase(),
      "data-new": obj.new,
      "data-featured": obj.featured,
    }).forEach(([key, value]) => li.setAttribute(key, value));

    li.classList.add("card", "px-4", "py-3", "gap-3", "shadow");

    const newBadge = obj.new ? `<span class="badge new">NEW!</span>` : "";
    const featuredBadge = obj.featured
      ? `<span class="badge featured">FEATURED</span>`
      : "";

    li.innerHTML = `
      <div class="d-flex flex-row gap-3 align-items-center">
        <img src="${obj.logo}" alt="${obj.company} logo">
        <div class="d-flex flex-column justify-content-between">
          <div class="d-flex flex-row gap-3 align-items-center">
            <span>${obj.company}</span>
            ${newBadge}
            ${featuredBadge}
          </div>
          <h3>${obj.position}</h3>
          <div class="d-flex flex-row gap-3">
            <span class="opacity-75">${obj.postedAt}</span>
            <span class="opacity-75">${obj.contract}</span>
            <span class="opacity-75">${obj.location}</span>
          </div>
        </div>
      </div>
      <div class="d-flex flex-row gap-3 flex-wrap label-container align-items-center">
        ${[obj.role, obj.level, ...obj.languages, ...obj.tools]
          .map((item) => `<span class="label">${item}</span>`)
          .join("")}
      </div>
    `;

    li.querySelectorAll(".label").forEach((label) => {
      label.addEventListener("click", () => {
        const filter = label.textContent;
        if (!activeFilters.includes(filter)) {
          activeFilters.push(filter);
          updateFilters();
          filterJobListings();
        }
      });
    });

    jobList.appendChild(li);
  });
}

function updateFilters() {
  filtersDiv.innerHTML = "";

  if (activeFilters.length > 0) {
    filtersDiv.classList.add("active");

    activeFilters.forEach((filter) => {
      const filterSpan = document.createElement("div");
      filterSpan.classList.add("filter-item");
      filterSpan.innerHTML = `<span>${filter}</span>`;

      const removeBtn = document.createElement("button");
      removeBtn.classList.add("remove-filter");
      removeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"><path fill="#FFF" fill-rule="evenodd" d="M11.314 0l2.121 2.121-4.596 4.596 4.596 4.597-2.121 2.121-4.597-4.596-4.596 4.596L0 11.314l4.596-4.597L0 2.121 2.121 0l4.596 4.596L11.314 0z"/></svg>`;
      removeBtn.addEventListener("click", () => {
        activeFilters = activeFilters.filter((f) => f !== filter);
        updateFilters();
        filterJobListings();
      });

      filterSpan.appendChild(removeBtn);
      filtersDiv.appendChild(filterSpan);
    });

    const clearBtn = document.createElement("button");
    clearBtn.classList.add("clear-filters");
    clearBtn.textContent = "Clear";
    clearBtn.addEventListener("click", () => {
      activeFilters = [];
      updateFilters();
      filterJobListings();
    });

    filtersDiv.appendChild(clearBtn);
  } else {
    filtersDiv.classList.remove("active");
  }
}

function filterJobListings() {
  let filteredData = jsondata;

  if (activeFilters.length > 0) {
    filteredData = jsondata.filter((job) => {
      const tags = [job.role, job.level, ...job.languages, ...job.tools];
      return activeFilters.every((filter) => tags.includes(filter));
    });
  }

  renderJobListings(filteredData);
}
