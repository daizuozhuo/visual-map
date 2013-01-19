var datetimer;
var isstart;
var layer;
var cdate;
var map;
var min_date;
var max_date;
var low_bound;
var high_bound;
var middle_point;
var changed;
var circles;

function initialize() {
    cdate = new Date(2004,6,1);
    min_date = -1;
    max_date= 99999999;
    changed = true;
    //update_layer();
    time_start();
    analysis();
    changed = true;
    circles = [];
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
    drawChart(date_to_number(low_bound), date_to_number(high_bound));
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
      low_bound = calDate(0);
      high_bound = calDate(1000); 
      middle_point = calDate(500);
    }
    for (var i = 1; i < line.length; i++)
    {
	if (line[i] == null || line[i] == '')
	{
		continue;
	}
	var found = false;
	var temp = line[i].split(',');
	var temp_date = number_to_date(parseInt(temp[2]));
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
			places[j].rate += parseInt(temp[1]) * (number_to_date(temp[2]).getTime() - middle_point.getTime());
			found = true;
			break;
		}
	}
	if (!found)
	{
		var p = {name:temp[0],count:parseInt(temp[1]),lng:temp[3],lat:temp[4],rate: parseInt(temp[1]) * (number_to_date(temp[2]).getTime() - middle_point.getTime())};
		places.push(p);
	}

}
}

function layer()
{
    var cityCircle;
    var total = 0;    
    for (var i = 0; i < places.length; i++)
    {
        total += places[i].count;
        places[i].rate /= places[i].count * (high_bound.getTime() - low_bound.getTime());
        //console.log(places[i]);
    }

    for (var i = 0; i < places.length; i++)
    {
       //console.log(places[i].name + ": " + rgb(places[i].rate));
        var populationOptions = {
          strokeColor: rgb(places[i].rate),
          strokeOpacity: 0.0,
          strokeWeight: 2,
          fillColor: rgb(places[i].rate),
          fillOpacity: 0.35,
          map: map,
          center: new google.maps.LatLng(places[i].lat, places[i].lng),
          radius: places[i].count * 5000000 / total
        };
        cityCircle = new google.maps.Circle(populationOptions);
	  circles[places[i].name] = cityCircle;
    }
}

function rgb(rate)
{
var r = 128 + 256 * rate;
var b = 128 + -256 * rate;
var g = 128
return '#' + prune(r) + prune(g) + prune(b);
}

function prune(v)
{
   if (v < 0) v = 0;
   if (v > 255) v = 255;
   var t = parseInt(v).toString(16);
   if (t.length ==1) t = '0' + t;
   return t;
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
    datetimer = setTimeout("update_date()",1000);
}

function update_date() {
    //cdate.setDate(cdate.getDate() + 1);
    //document.getElementById("map_date").innerHTML=cdate.toDateString();
    if (changed == true)
    {
	  	changed = false;
		repaint();
    }
    if (isstart) {
        datetimer = setTimeout("update_date()", 1000);
    }
}

function UTC(date)
{	
	return Date.UTC(date.substring(0,4),date.substr(4,2),date.substr(6,2));
}

function calDate(date)
{
var utc = UTC(min_date) + (UTC(max_date) - UTC(min_date)) * date / 1000;	
//console.log(new Date(utc));
return new Date(utc);
}

  $(function() {
    $( "#slider-range" ).slider({
      orientation: "horizontal",
      range: true,
      min: 0,
      max: 1000,
      values: [0, 1000],
      slide: function( event, ui ) {
        $( "#amount" ).val(calDate(ui.values[0]).toDateString() + " - " + calDate(ui.values[1]).toDateString() );

		low_bound = calDate(ui.values[0]);
		high_bound = calDate(ui.values[1]);
		middle_point = calDate((ui.values[0] + ui.values[1]) / 2);
		changed = true;
      }
    });
    $( "#amount" ).val('Select Date:');
		changed = true;
  });

