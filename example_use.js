
const canvas = document.querySelector("#chart");

// - - - -  COLUMN CHART  - - - - 

const chart  = new ColumnChart(canvas); //pass canvas element to constructor

chart.add(["apple","apple","banana","banana","orange"]); //add array of elements
chart.add("apple"); //add single element
chart.add("melon");
chart.add({name:"strawberry",count:12}); //add object
chart.add( new Map([["potatoe",9],["carrot",7]])); //add map
chart.add("pineapple",9); // add two parameters

chart.showOnly(3); // show max 3 main columns
chart.appendOther(true); // append "other" column, now 4 in total. if other element is last item, then it's name will be original element name
chart.setColumnWidth(0.8); //set column width to 80% of section. Section is canvas width divided by amount of columns
chart.setHslColor(20, 0.85, 0.5, 25); // start hue at 20, saturation 85%, lightness 50%, increase hue per column by 25
chart.setDisplayMode("absolute"); // "absolute", "relative" or "difference".
chart.setAscending(false); // set descending 
chart.setFont(0,"white","arial"); // font: 0 is for auto font size, other value can be any valid css value
chart.setFramePadding(0.06); // empty area where text is displayed
chart.setDrawingFrame(true); // draw frame. if not, padding will be 0 and frame not be drawed along with text

chart.remove("apple"); // remove single element
chart.remove(["strawberry","strawberry","carrot"]); // remove 2 strawberries, and 1 carrot
chart.remove(new Map([["strawberry",4],["potatoe",2]])); // remove elements
chart.clear("carrot"); // remove element
chart.clear(true); // remove all data and values
//create elements to display
chart.add("Tiramisu",5);
chart.add("Lemon cake");
chart.add("Chocolate cake",8);
chart.add("Brownie",3);
chart.add("Coconut cake");

chart.draw(); //draw chart
