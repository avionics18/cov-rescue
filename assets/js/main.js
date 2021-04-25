$(document).ready(function () {
  // --- fetching STATE covid data ----
  let stateData;
  $.get("https://api.covid19india.org/data.json", function (data) {
    stateData = data;
    let options = "";
    for (let i = 0; i < data.statewise.length - 1; i++) {
      if (i == 0) {
        options += `<option value="${i}" selected>Choose State...</option>`;
      } else {
        options += `<option value="${i}">${data.statewise[i].state}</option>`;
      }
    }
    $("#stats-form select").append(options);
  });



  //  --- fetching DISTRICT covid data ---
  const districtData = {};
  $.get("https://api.covid19india.org/state_district_wise.json", function (data) {
    $.each(data, (key1, value1) => {
      if(key1 == "State Unassigned"){
        return true;
      }
      else{
        let arr = [];
        $.each(value1.districtData, (key2, value2) => {
          const obj = {
            district: key2,
            active: value2.active,
            confirmed: value2.confirmed,
            recovered: value2.recovered,
            deceased: value2.deceased,
          };
          arr.push(obj);
        });
        districtData[key1] = arr;
      }
    });
  });





  // --- fetching Medical Colleges data ---
  $.get("https://api.rootnet.in/covid19-in/hospitals/medical-colleges", function (data) {
    // initialize datatable - med college
    $("#med-colleges table").DataTable({
      data: data.data.medicalColleges,
      columns: [
        { data: "state" },
        { data: "name" },
        { data: "city" },
        { data: "ownership" },
        { data: "admissionCapacity" },
        { data: "hospitalBeds" }
      ],
    });
  });


  // --- fetching hospital beds data ---
  $.get("https://api.rootnet.in/covid19-in/hospitals/beds", function (data) {
    // initialize datatable - hospital bed
    $("#hospital-beds table").DataTable({
      data: data.data.regional,
      columns: [
        { data: "state" },
        { data: "ruralHospitals" },
        { data: "ruralBeds" },
        { data: "urbanHospitals" },
        { data: "urbanBeds" },
        { data: "totalHospitals" },
        { data: "totalBeds" },
        { data: `asOn` }
      ],
    });
  });

  // --- fetching contacts data ---
  $.get("https://api.rootnet.in/covid19-in/contacts", function (data) {
    // initialize datatable - contacts
    $("#contacts table").DataTable({
      data: data.data.contacts.regional,
      columns: [
        { data: "loc" },
        { data: "number" }
      ],
    });
  });



  // --- fetching Notifications data ---
  $.get("https://api.rootnet.in/covid19-in/notifications", function (data) {

    let arr = [];
    $.each(data.data.notifications, (index, value) => {
      if(index){
        const obj = {
          sr_no: index,
          date: value.title.substr(0, value.title.indexOf(" ")),
          title: value.title.substr(value.title.indexOf(" ")+1),
          link: `<a href=${value.link} class="btn btn-danger btn-sm text-nowrap" target="_blank"><i class="fa fa-file-pdf-o"></i></a>`
        };
        arr.push(obj);
      }
    });

    // initialize datatable - notifications
    $("#notifications table").DataTable({
      data: arr,
      columns: [
        { data: "sr_no" },
        { data: "date" },
        { data: "title" },
        { data: "link" }
      ],
    });
  });




  // --- SUBMIT FORM ---
  $("#stats-form").submit(function (e) {
    e.preventDefault();
    if (e.target.selectInp.value != 0) {
      const { active, confirmed, recovered, deaths, state } = stateData.statewise[
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

      // insert content inside the STATE tracker
      $("#states-tracker").html(content);



      // =================== District Wise Covid Data ===================
      let distTableContent = `<div class="heading position-absolute w-100 d-flex justify-content-center"><h5 class="heading-text py-2 px-4">District Wise Data</h5></div><table class="table table-bordered table-hover table-responsive-xl w-100 small"><thead class="thead-dark"><tr><th>District</th><th>Active</th><th>Confirmed</th><th>Recovered</th><th>Deceased</th></tr></thead><tfoot class="thead-dark"><tr><th>District</th><th>Active</th><th>Confirmed</th><th>Recovered</th><th>Deceased</th></tr></tfoot></table>`;

      $("#district-tracker").html(distTableContent);

      // initialize datatable - districtTracker
      $("#district-tracker table").DataTable({
        data: districtData[state],
        columns: [
          { data: "district" },
          { data: "active" },
          { data: "confirmed" },
          { data: "recovered" },
          { data: "deceased" }
        ],
      });
    }
    else {
      alert("Please select a valid state!");
    }
  });
  // stats-form submit 
});
// ready() 
