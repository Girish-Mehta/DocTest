function getData() {
	var xmlhttp = new XMLHttpRequest();
	var url = "http://localhost:3000/db";
	xmlhttp.open("GET", url, true);
	xmlhttp.send();

	xmlhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var myarr = JSON.parse(this.responseText);
      console.log(myarr);
      document.getElementById('fnameOne').innerHTML = myarr.output[0].name;
			document.getElementById('extOne').innerHTML = myarr.output[0].ext;
			document.getElementById('wcOne').innerHTML = myarr.output[0].wordCount;
			document.getElementById('ncOne').innerHTML = myarr.output[0].nounCount;
			document.getElementById('vcOne').innerHTML = myarr.output[0].verbCount;
			document.getElementById('acOne').innerHTML = myarr.output[0].adjCount;
			document.getElementById('fnameTwo').innerHTML = myarr.output[1].name;
			document.getElementById('extTwo').innerHTML = myarr.output[1].ext;
			document.getElementById('wcTwo').innerHTML = myarr.output[1].wordCount;
			document.getElementById('ncTwo').innerHTML = myarr.output[1].nounCount;
			document.getElementById('vcTwo').innerHTML = myarr.output[1].verbCount;
			document.getElementById('acTwo').innerHTML = myarr.output[1].adjCount;
			document.getElementById('stat').innerHTML = myarr.output[2].status;
			// document.getElementById('scoreTwo').innerHTML = myarr.output[2].points;
			document.getElementById('simPerc').innerHTML = myarr.output[2].similarity+"%";
			document.getElementById('remarks').innerHTML = myarr.output[2].remarks;
    }
  };
}

function compare(){
  document.getElementById("output-info-close").style.display = "block";
  document.getElementById("output-info").style.display = "block";
  getData();
}

function back(){
  document.getElementById("output-info-close").style.display = "none";
  document.getElementById("output-info").style.display = "none";
}
