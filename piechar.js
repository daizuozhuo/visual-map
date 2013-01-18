// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
//google.setOnLoadCallback(drawChart);


// instantiates the pie chart, passes in the data and
// draws it.
var char;
var words;
var data;
function drawChart(begin, end) {
    var query= "SELECT word, SUM(count) " +
        "FROM 17rjTQDK2VVO92FYqL9k6jrNT6Cg4uFxkoEg35IY " +
        "WHERE date>='" + begin + "' AND date<='" + end +
        "' GROUP BY word "+
        "ORDER BY SUM(count) {DESC} "+
        "LIMIT 10";
    var queryText = encodeURIComponent(query);
    var gvizQuery = new google.visualization.Query(
        'http://www.google.com/fusiontables/gvizdata?tq=' + queryText);
    // Send query and draw chart with data in response
    gvizQuery.send(function(response) {
        data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        var numRows = response.getDataTable().getNumberOfRows();
        for (var i = 0; i < numRows; i++) {
            data.addRow([
                response.getDataTable().getValue(i,0),
                response.getDataTable().getValue(i,1)
            ]);
         //   words[i]=response.getDataTable().getValue(i,0);
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
circle.fillOpacity = 0.35;
circle.setMap();
circle.setMap(map);
}   

function drawLineChart(begin, end, words, numRows) {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'x');
    for(var i = 0; i < numRows; i++) {
    var query= "SELECT count " +
        "FROM 17rjTQDK2VVO92FYqL9k6jrNT6Cg4uFxkoEg35IY " +
        "WHERE word='"+words[i]+
        "' AND date>='" + begin + "' AND date<='" + end + "'";
    var queryText = encodeURIComponent(query);
    var gvizQuery = new google.visualization.Query(
        'http://www.google.com/fusiontables/gvizdata?tq=' + queryText);
    // Send query and draw chart with data in response
    gvizQuery.send(function(response) {
    });
    }    
    
   
} 
   

