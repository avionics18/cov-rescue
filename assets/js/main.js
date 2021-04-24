$(document).ready(function () {
  // --- fetching COVID data ----
  let covidData;
  $.get("https://api.covid19india.org/data.json", function (data) {
    covidData = data;
    let options = "";
    for (let i = 0; i < data.statewise.length - 1; i++) {
      if (i == 0) {
        options += `<option value="${i}" selected>Choose State...</option>`;
      } else {
        options += `<option value="${i}">${data.statewise[i].state}</option>`;
      }
    }
    $("#selectStates").append(options);
  });

  // --- fetching COVID Resource ----
  let covidRes;
  $.get("./data/covidResource.json", function (data) {
    covidRes = data;
  });

  // --- SUBMIT FORM ---
  $("#searchbar").submit(function (e) {
    e.preventDefault();
    if (e.target.selectInp.value != 0) {
      const { active, confirmed, recovered, deaths, state } = covidData.statewise[
        e.target.selectInp.value
      ];
      let content = `<div class="heading position-absolute w-100 d-flex justify-content-center"><h4 class="heading-text py-2 px-4">${state}</h4></div><div class="row pt-5"><div class="col-md-6 mb-4"><div class="d-flex justify-content-around align-items-center bg-white shadow-sm-dark rounded-xl py-3"><div class="text-right"><h2>${parseInt(
        active
      ).toLocaleString()}</h2><p class="m-0 text-secondary">Total Active Cases</p></div><div> <img src="assets/imgs/active-icon.png" alt="active cases logo"></div></div></div><div class="col-md-6 mb-4"><div class="d-flex justify-content-around align-items-center bg-white shadow-sm-dark rounded-xl py-3"><div class="text-right"><h2>${parseInt(
        recovered
      ).toLocaleString()}</h2><p class="m-0 text-secondary">Recovered Cases</p></div><div> <img src="assets/imgs/recovered-icon.png" alt="recovered cases logo"></div></div></div><div class="col-md-6 mb-4"><div class="d-flex justify-content-around align-items-center bg-white shadow-sm-dark rounded-xl py-3"><div class="text-right"><h2>${parseInt(
        confirmed
      ).toLocaleString()}</h2><p class="m-0 text-secondary">Confirmed Cases</p></div><div> <img src="assets/imgs/confirmed-icon.png" alt="confirmed cases logo"></div></div></div><div class="col-md-6 mb-4"><div class="d-flex justify-content-around align-items-center bg-white shadow-sm-dark rounded-xl py-3"><div class="text-right"><h2>${parseInt(
        deaths
      ).toLocaleString()}</h2><p class="m-0 text-secondary">Total Deceased</p></div><div> <img src="assets/imgs/death-icon.png" alt="deaths cases logo"></div></div></div></div>`;

      // back to initial
      e.target.selectInp.value = 0;

      // insert content inside the covid tracker
      $("#covid-tracker").html(content);

      // --- Initialize the Datatable ---
      let tableContent = `<div class="heading position-absolute w-100 d-flex justify-content-center"><h5 class="heading-text py-2 px-4">Resources</h5></div><table class="table table-bordered table-hover table-responsive-xl w-100 small"><thead class="thead-dark"><tr><th>City</th><th class="text-nowrap">Hospital Beds</th><th>Oxygen</th><th class="text-nowrap">Remedesivir / Tocilizum</th><th>Plasma</th><th>Sources</th></tr></thead><tfoot class="thead-dark"><tr><th>City</th><th>Hospital Beds</th><th>Oxygen</th><th>Remedesivir / Tocilizum</th><th>Plasma</th><th>Sources</th></tr></tfoot></table>`;

      $("#covid-resources").html(tableContent);

      $("#covid-resources table").DataTable({
        data: covidRes.data[state],
        columns: [
          { data: "city" },
          { data: "hospital_beds" },
          { data: "oxygen" },
          { data: "remedesivir_tocilizum" },
          { data: "plasma" },
          { data: "sources" },
        ],
      });
    } else {
      alert("Please select a valid state!");
    }
  });

  // --------- About us page modal ---------
  $("#navbar button").on("click", function (e) {
    if (e.target.innerText.toLowerCase() == "home") {
      $("#abt-page").fadeOut();
      $("#navbar button").removeClass("active");
      $(this).addClass("active");
    } else {
      $("#abt-page").fadeIn();
      $("#navbar button").removeClass("active");
      $(this).addClass("active");
    }
  });
});
