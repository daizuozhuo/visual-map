var datetimer;
var isstart;
var layer;
var cdate;
var map;
var min_date;
var max_date;
var low_bound;
var high_bound;

function initialize() {
    cdate = new Date(2004,6,1);
    min_date = -1;
    max_date= 99999999;
    repaint();
    //update_layer();
    //time_start();

}

function repaint()
{
    var beijing = new google.maps.LatLng(39.93,116.4);
    map = new google.maps.Map(
    document.getElementById("map_canvas"), {
        center: beijing,
        zoom: 2,
        mapTypeControl: false,
        zoomControl: true,
        panControl: true,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
            {stylers: [{visibility: "on"}]},
            {featureType: "water",stylers: [
                {visibility: "on"},
                {color: "#d4d4d4"}]
            },
            {featureType: "landscape",stylers: [
                {visibility: "on"},
                {color: "#e5e3df"}]
            }
        ]
    });
    drawChart(20050523, 20060616);
    analysis();
    layer();
}

var places;
function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function analysis()
{
    var file = httpGet('http://ihome.ust.hk/~lliaa/generatetable.txt');
    var line = file.split('\r\n');
    places = [];
    if (min_date == -1)
    {
	min_date = (line[1].split(','))[2];
	max_date = (line[line.length - 2].split(','))[2];
    }
    for (var i = 1; i < line.length; i++)
    {
	if (line[i] == null || line[i] == '')
	{
		continue;
	}
	var found = false;
	var temp = line[i].split(',');
	var temp_date = parseInt(temp[2]);
	if (temp_date < low_bound)
	{
		continue;
	}
	if (temp_date > high_bound)
	{
		break;
	}
	for (var j = 0; j < places.length; j++)
	{
		if(temp[0] == places[j].name)
		{
			places[j].count += parseInt(temp[1]);
			found = true;
			break;
		}
	}
	if (!found)
	{
		var p = {name:temp[0],count:parseInt(temp[1]),lng:temp[3],lat:temp[4]};
		places.push(p);
	}

}
}

function layer()
{
    var cityCircle;
    for (var i = 0; i < places.length; i++)
    {
        var populationOptions = {
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          map: map,
          center: new google.maps.LatLng(places[i].lat, places[i].lng),
          radius: places[i].count * 1000
        };
        cityCircle = new google.maps.Circle(populationOptions);
    }
}

function update_layer() {
    var sdate = date_to_number(cdate);
    //if (layer != null)	
    	//layer.setMap();
    layer = new google.maps.FusionTablesLayer({
        query: {
            select:'Longitude',
            from: '17rjTQDK2VVO92FYqL9k6jrNT6Cg4uFxkoEg35IY',
            where: 'date<=20040714 and date>=20040701'
        },
 styles: [{
   markerOptions: {
    iconName: "large_green"
  }
  }]
    });
    layer.setMap(map);
}

function date_to_number(mydate) {
    mydate = new Date(mydate);
    var year = mydate.getFullYear();
    var month = mydate.getMonth()+1;
    var day = mydate.getDate();
    return year*10000 + month*100 + day;
}

function number_to_date(mynumber) {
    var mydate = new Date();
    mydate.setFullYear(mynumber/10000);
    mydate.setMonth(mynumber%10000/100 -1);
    mydate.setDate(mynumber%100);
    return mydate;
}

function time_start() {
    isstart = true;
    //datetimer = setTimeout("update_date()",1000);
}

function update_date() {
    cdate.setDate(cdate.getDate() + 1);
    document.getElementById("map_date").innerHTML=cdate.toDateString();
    update_layer();
    if (isstart) {
        datetimer = setTimeout("update_date()", 1000);
    }
}

function calDate(date)
{
	return parseInt(min_date) + parseInt((max_date - min_date) * date / 1000);	
}

  $(function() {
    $( "#slider-range" ).slider({
      orientation: "horizontal",
      range: true,
      min: 0,
      max: 1000,
      values: [ 75, 300 ],
      slide: function( event, ui ) {
        $( "#amount" ).val(calDate(ui.values[0]) + " - " + calDate(ui.values[1]) );
		low_bound = calDate(ui.values[0]);
		high_bound = calDate(ui.values[1]);
		repaint();
      }
    });
    $( "#amount" ).val( calDate($( "#slider-range" ).slider( "values", 0 )) +
      " - " + calDate($( "#slider-range" ).slider( "values", 1 )) );
		repaint();
  });

