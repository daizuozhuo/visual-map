// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages':['corechart']});
var TABLEID = '1iPNblST2mpl_izmOjtDTGEygA8RFFnd6KIcDC5w';
var nresponse = 0;
// Set a callback to run when the Google Visualization API is loaded.
//google.setOnLoadCallback(drawChart);


// instantiates the pie chart, passes in the data and
// draws it.
var data;
function drawChart(begin, end) {
    var query= "SELECT word, SUM(count) " +
        "FROM " + TABLEID +
        " WHERE date>='" + begin + "' AND date<='" + end +
        "' GROUP BY word "+
        "ORDER BY SUM(count) {DESC} "+
        "LIMIT 10";
    var queryText = encodeURIComponent(query);
    var gvizQuery = new google.visualization.Query(
        'http://www.google.com/fusiontables/gvizdata?tq=' + queryText);
    // Send query and draw chart with data in response
    gvizQuery.send(function(response) {
        var words = new Array();
        data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        var numRows = response.getDataTable().getNumberOfRows();
        for (var i = 0; i < numRows; i++) {
            data.addRow([
                response.getDataTable().getValue(i,0),
                response.getDataTable().getValue(i,1)
            ]);
            words[i]=response.getDataTable().getValue(i,0);
        }
        var options = {'title' : 'top 10 places',
            'width' : 400,
            'height' : 300,
            'is3D' : true,
		'enableEvents' : true,
            backgroundColor: {fill:'transparent'}
        };
        char = new google.visualization.PieChart(
            document.getElementById('piechart'));
        char.draw(data, options);

google.visualization.events.addListener(char, 'onmouseover', onOver);
google.visualization.events.addListener(char, 'onmouseout', onOut);
        drawLineChart(begin,end,words,numRows);

    });

}



   function onOver(event)  
{
var circle = circles[data.za[event.row][0].ph];
circle.fillOpacity = 0.7;
circle.setMap();
circle.setMap(map);
}   

   function onOut(event)  
{
var circle = circles[data.za[event.row][0].ph];
circle.fillOpacity = 0.5;
circle.setMap();
circle.setMap(map);
}   

function drawLineChart(begin, end, words, numwords) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'x');
    for(var n = 0; n < numwords; n++) {
        data.addColumn('number', words[n]);
    }
    var bdate = number_to_date(begin);
    var edate = number_to_date(end);
    var months = (edate.getFullYear() - bdate.getFullYear())*12 +
      (edate.getMonth() - bdate.getMonth());
    data.addRows(months);
    var mydate = bdate;
    for(var k = 0; k < months; k++) {
        data.setCell(k,0,mydate.getFullYear()+"/"+mydate.getMonth());
        mydate.setDate(mydate.getDate() + 30);
    }
    nresponse = 0;
    for(var i = 0; i < numwords; i++) {
        var query= "SELECT date, count, word " +
            "FROM " + TABLEID + 
            " WHERE word='"+words[i]+
            "' AND date>='" + begin + "' AND date<='" + end +
            "' ORDER BY date";
        var queryText = encodeURIComponent(query);
        var gvizQuery = new google.visualization.Query(
            'http://www.google.com/fusiontables/gvizdata?tq=' + queryText);
        // Send query and draw chart with data in response
        gvizQuery.send(function(response) {
            nresponse +=1;
            var table = response.getDataTable();
            var num = table.getNumberOfRows();
            var cmonth = Math.floor(begin/100);//current month
            var nmonth = 0; //number of month
             //stores sum of count for each month, init it
            var carray = new Array();
            for(var l = 0; l < months; l++) {
                carray[l] = 1;
            }
            //set carray
            for (var j = 0; j < num; j++) {
                if(Math.floor(table.getValue(j,0)/100) == cmonth) {
                    carray[nmonth] += table.getValue(j,1);
                } else {
                    cmonth += 1;
                    nmonth += 1;
                    if(cmonth%100 == 13) {
                        cmonth = cmonth + 100 - 12;
                    }
                }
            }
            //set data
            var iword = 0;
            var returnword = table.getValue(0,2);
            for(var k=0; k < numwords; k++) {
                if(returnword == words[k]) {
                    iword = k;
                    break;
                }
            }
            for(var m = 0; m < months; m++) {
                //m month i word carray[m] count
                data.setCell(m, iword+1, carray[m]);
            }
            if(nresponse == numwords) {
               // console.log(data.toJSON());
                var linechart =new google.visualization.LineChart(
                document.getElementById('linechart'));
                linechart.draw(data, {
                    curveType: "function",
                    'is3D' : true,
                    backgroundColor: {fill:'transparent'},
                    width: 1000, height: 150,
                    vAxis:{minValue:1, logScale: true}
                });
            }
        });
    }
   
} 


