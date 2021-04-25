$(document).ready(function () {
  fetch("https://api.covid19india.org/state_district_wise.json")
    .then((res) => res.json())
    .then((data) => prepareData(data))
    .catch((err) => {
      console.log(err.message);
    });

  
  function prepareData(data) {
    const districtData = {};
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
  }
});
