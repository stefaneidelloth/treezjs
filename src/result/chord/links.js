import GraphicsAtom from './../graphics/graphicsAtom.js';
import Color from './../../components/color/color.js';
import Length from './../graphics/Length.js';

export default class Links extends GraphicsAtom {
	
	constructor(){
		super();		
		this.isUsingFillGradient = true;			
	}

	createPage(root) {
		
		var tab = root.append('treez-tab')
			.label('Links');
		
		var section = tab.append('treez-section')
			.label('Links');
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-check-box')
			.label('Is using fill gradient')			
			.bindValue(this, ()=>this.isUsingFillGradient);			
	}
	

	plot(dTreez, chordSelection, rectSelection, chord) {		
		var chordData = chord.chordData;

		var graph = chord.graph;
		var graphWidth = Length.toPx(graph.data.width);
		var graphHeight = Length.toPx(graph.data.height);
		var size = Math.min(graphWidth, graphHeight);

		var outerRadius = Length.toPx(chord.data.outerRadius);
		var innerRadius = Length.toPx(chord.data.innerRadius);
		
		var centeredContainer = chordSelection.append('g')
		    .attr('transform','translate('+ graphWidth/2+ ',' + graphHeight/2 +')');


        var colors = [ "red", "blue", "green", "yellow"];

		var matrix = [
			  [  0, 100,   0,  100], //flows from red region 1 to region ...
			  [100,   0,   100,  0], //flows from blue region 2 to region ...
			  [  0, 100,    0,   0], //flows from green region 3 to region ...
			  [100,   0,    0,   0], //flows from yellow region 4 to region ...  
			]; 

		var chordDatum = dTreez.chord()
					.padAngle(0.05)     // padding between entities (black arc)
					.sortSubgroups(dTreez.descending)
					(matrix); 

		// add the notes 
        centeredContainer
		  .datum(chordDatum)
		  .append("g")
		  .selectAll("g")
		  .data(function(d) { return d.groups; })
		  .enter()
		  .append("g")
		  .append("path")
			.style("fill", function(d,i){ return colors[i] })
			.style("stroke", "black")
			.attr("d", dTreez.arc()			  
			  .outerRadius(outerRadius)
			  .innerRadius(innerRadius)
			);

		// Add the links 
		centeredContainer
		  .datum(chordDatum)
		  .append("g")
		  .selectAll("path")
		  .data(function(d) { return d; })
		  .enter()
		  .append("path")
			.attr("d", dTreez.ribbon()
			  .radius(innerRadius)
		  )
		  .style("fill", function(d){ return(colors[d.source.index]) })
		  .style("stroke", "black");

		 //create nodeGroups
		var nodeGroups = centeredContainer
		  .datum(chordDatum)
		  .append("g")
		  .selectAll("g")
		  .data(function(d) { return d.groups; })
		  .enter()   

		  // Add ticks
		nodeGroups
		  .selectAll(".group-tick")
		  .data(function(d) { return groupTicks(d, 25); })    // Controls the number of ticks: one tick each 25 here.
		  .enter()
		  .append("g")
			.attr("transform", function(d) { return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + outerRadius + ",0)"; })
		  .append("line")               // By default, x1 = y1 = y2 = 0, so no need to specify it.
			.attr("x2", 6)
			.attr("stroke", "black")

		// Add tick labels
		nodeGroups
		  .selectAll(".group-tick-label")
		  .data(function(d) { return groupTicks(d, 25); })
		  .enter()
		  .filter(function(d) { return d.value % 25 === 0; })
		  .append("g")
			.attr("transform", function(d) { return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + outerRadius + ",0)"; })
		  .append("text")
			.attr("x", 8)
			.attr("dy", ".35em")
			.attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180) translate(-16)" : null; })
			.style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
			.text(function(d) { return d.value })
			.style("font-size", 9)


		// Returns an array of tick angles and values for 
		// a given node group and step.
		function groupTicks(d, step) {
		  var k = (d.endAngle - d.startAngle) / d.value;
		  return dTreez.range(0, d.value, step).map(function(value) {
			return {value: value, angle: value * k + d.startAngle};
		  });
		}

		//add node labels

		nodeGroups.append("svg:text")
		  .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
		  .attr("dy", ".35em")
		  .attr("class", "titles")
		  .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
		  .attr("transform", function(d) {
				return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
				+ "translate(" + (innerRadius+40) + ")"
				+ (d.angle > Math.PI ? "rotate(180)" : "");
		  })     
		  .text(function(d,i) { return colors[i]; });  
		

		return chordSelection;
	}	
}
