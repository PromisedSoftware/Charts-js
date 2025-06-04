// test ColumnChart
let canvas = document.querySelector("#chart");

// - - - -  COLUMN CHART  - - - - 

let chart  = new ColumnChart(canvas); //pass canvas element to constructor

chart.add(["apple","apple","banana","banana","orange"]); //add array of elements
chart.add("apple"); //add single element
chart.add("melon");
chart.add({name:"strawberry",count:12}); //add object
chart.add( new Map([["potatoe",9],["carrot",7]])); //add map
chart.add("pineapple",9); // add two parameters

chart.showOnly(3); // show max 7 main columns
chart.appendOther(true); // append "other" column, now 8 in total. if other is last item it's name will be original
chart.setColumnWidth(0.8); //set column width to 80% of section. Section is canvas width divided by amount of columns
chart.setHslColor(20, 0.85, 0.5, 25); // start hue at 20, saturation 85%, lightness 50%, increase hue per column by 25
chart.setDisplayMode("absolute"); // "absolute", "relative" or "difference".
chart.setAscending(false); // set descending 
chart.setFont(0,"white","arial"); // font: 0 is auto font size, color, family
chart.setFramePadding(0.06); // text is displayed on the padding section
chart.setDrawingFrame(true); // draw frame or not. if not, padding will be 0 and frame not drawed as well as text with names

chart.remove("apple"); //remove single element
chart.remove(["strawberry","strawberry","carrot"]); // remove 2 strawberry, and 1 carrot
chart.remove(new Map([["strawberry",4],["potatoe",2]])); // remove elements
chart.clear("carrot"); //remove element
chart.clear(true); // remove all data and valeus

chart.add("Tiramisu",5);
chart.add("Lemon cake");
chart.add("Chocolate cake",8);
chart.add("Brownie",3);
chart.add("Coconut cake");

chart.draw(); //draw chart