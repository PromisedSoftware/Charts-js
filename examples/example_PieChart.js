
//
const pieChartCanvas = document.querySelector("#pie-chart");
const pieChart = new PieChart(pieChartCanvas);

pieChart.add(["apple","apple","banana","banana","orange"]); //add array of elements
pieChart.add("apple"); //add single element
pieChart.add("melon");
pieChart.add({name:"strawberry",count:12}); //add object
pieChart.add( new Map([["potatoe",9],["carrot",7]])); //add map
pieChart.add("pineapple",9); // add two parameters

pieChart.showOnly(3); // show 3 main values or less
pieChart.appendOther(true); // append "other" value, now 4 in total to draw. if other element is last item, it's name will be original name
pieChart.setHslColor(20, 0.85, 0.5, 25); // start hue at 20, saturation 85%, lightness 50%, increase hue per column by 25
pieChart.setAscending(false); // set descending 
pieChart.setFont(0,"white","arial"); // font: 0 is for auto font size, other value can be any valid css value
pieChart.setFramePadding(0); // empty area where text is displayed
pieChart.setDrawingFrame(true); // draw frame. if not, padding will be 0 and frame not be drawed along with text

pieChart.remove("apple"); // remove single element
pieChart.remove(["strawberry","strawberry","carrot"]); // remove 2 strawberries, and 1 carrot
pieChart.remove(new Map([["strawberry",4],["potatoe",2]])); // remove elements
pieChart.clear("carrot"); // remove element
pieChart.clear(true); // remove all data and values
//create elements to display
pieChart.add("Tiramisu",5);
pieChart.add("Lemon cake");
pieChart.add("Chocolate cake",8);
pieChart.add("Brownie",3);
pieChart.add("Coconut cake");

pieChart.draw(); //draw chart