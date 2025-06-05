// - - - -  COLUMN CHART  - - - - 
const columnChartCanvas = document.querySelector("#column-chart");
const columnChart  = new ColumnChart(columnChartCanvas); //pass canvas element to constructor

columnChart.add(["apple","apple","banana","banana","orange"]); //add array of elements
columnChart.add("apple"); //add single element
columnChart.add("melon");
columnChart.add({name:"strawberry",count:12}); //add object
columnChart.add( new Map([["potatoe",9],["carrot",7]])); //add map
columnChart.add("pineapple",9); // add two parameters

columnChart.showOnly(3); // show 3 main values or less
columnChart.appendOther(true); // append "other" value, now 4 in total to draw. if other element is last item, it's name will be original name
columnChart.setColumnWidth(0.8); //set column width to 80% of section. Section is canvas width divided by amount of columns
columnChart.setHslColor(20, 0.85, 0.5, 25); // start hue at 20, saturation 85%, lightness 50%, increase hue per column by 25
columnChart.setDisplayMode("relative"); // "absolute", "relative" or "difference".
columnChart.setAscending(false); // set descending 
columnChart.setFont(0,"white","arial"); // font: 0 is for auto font size, other value can be any valid css value
columnChart.setFramePadding(0.06); // empty area where text is displayed
columnChart.setDrawingFrame(true); // draw frame.

columnChart.remove("apple"); // remove single element
columnChart.remove(["strawberry","strawberry","carrot"]); // remove 2 strawberries, and 1 carrot
columnChart.remove(new Map([["strawberry",4],["potatoe",2]])); // remove elements
columnChart.clear("carrot"); // remove element
columnChart.clear(true); // remove all data and values
//create elements to display
columnChart.add("Tiramisu",5);
columnChart.add("Lemon cake");
columnChart.add("Chocolate cake",8);
columnChart.add("Brownie",3);
columnChart.add("Coconut cake");

columnChart.draw(); //draw chart